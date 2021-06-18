<template>
  <v-container>
    <v-card>
      <v-card-title>
        Compressor / Limitter
        <indicator :color="indicator.color" />
      </v-card-title>
      <v-container>
        <v-row>
          <v-col cols="4">
            <v-card color="grey lighten-2">
              <!-- <v-sparkline height="250" :value="values" line-width="3" /> -->
              <LineChart :labels="labels" :values="values" />
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-row>
              <v-col>
                <v-slider
                  label="Gain"
                  thumb-label="always"
                  v-model="gain"
                  min="-127"
                  max="127"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-slider
                  label="Scale"
                  thumb-label="always"
                  v-model="scale"
                  min="-5"
                  max="5"
                  step="0.01"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-slider
                  label="Threshold"
                  thumb-label="always"
                  v-model="threshold"
                  min="0"
                  max="127"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="2">
                <v-btn @click="reset"> Reset </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import LineChart from '@/components/LineChart.vue'
import midimodule from '@/mixins/midimodule'
import { Helpers } from '@/utils/helpers'
import { MidiMessage } from '@/utils/midimessage'

export default {
  name: 'Compressor',
  mixins: [midimodule],
  components: { LineChart },

  data: () => ({

    gain: 0,
    scale: 1,
    threshold: 0,

    labels: Array.from(Array(128).keys()),
    values: [],

  }),

  methods: {

    process(data) {
      if (MidiMessage.is(data, MidiMessage.Channel.NOTE_ON)) {
        data[2] = this.values[data[2]]
        this.showIndicator()
      }
      this.send(data)
    },

    calcValues() {
      let val = []
      for (let i = 0; i < 128; i++) {
        let tmpScale = this.scale
        let extraGain = (1.0 - this.scale) * this.threshold
        if (i < this.threshold) {
          tmpScale = 1
          extraGain = 0
        }
        let v = i * tmpScale + this.gain + extraGain
        val.push(Helpers.clamp(Math.round(v), 0, 127))
      }
      this.values = val
    },

    reset() {
      this.gain = 0
      this.scale = 1
      this.threshold = 0
    },

  },

  mounted() {
    this.calcValues()
  },

  watch: {
    gain: function() {
        this.calcValues()
    },
    scale: function() {
        this.calcValues()
    },
    threshold: function() {
        this.calcValues()
    },
  },

}
</script>
