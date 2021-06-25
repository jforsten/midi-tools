<template>
  <v-container>
    <v-card>
      <v-card-title>
        Tremolo
        <indicator :color="indicator.color" />
      </v-card-title>
      <v-container class="mx-2 px-4">
         <v-row>
          <v-col cols="2">
            Midi channel
          </v-col>
          <v-col cols="5">
            <v-slider v-model="channel" min="1" max="16" step="1" thumb-label="always">
              <template v-slot:prepend>
                <v-icon @click="decrement()">
                  mdi-minus
                </v-icon>
              </template>
              <template v-slot:append>
                <v-icon @click="increment()">
                  mdi-plus
                </v-icon>
              </template>
            </v-slider>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            Rate
          </v-col>
          <v-col cols="10">
            <v-slider v-model="lfoRate" min="0.1" max="10" step="0.1" thumb-label="always">
              <template v-slot:prepend>
                <v-icon @click="decrement()">
                  mdi-minus
                </v-icon>
              </template>
              <template v-slot:append>
                <v-icon @click="increment()">
                  mdi-plus
                </v-icon>
              </template>
            </v-slider>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            Amount(%)
          </v-col>
          <v-col cols="10">
            <v-slider v-model="gain" min="0" max="100" step="1" thumb-label="always">
              <template v-slot:prepend>
                <v-icon @click="decrement()">
                  mdi-minus
                </v-icon>
              </template>
              <template v-slot:append>
                <v-icon @click="increment()">
                  mdi-plus
                </v-icon>
              </template>
            </v-slider>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import midimodule from '@/mixins/midimodule'
import { MidiMessage } from '@/utils/midimessage'

export default {
  name: 'Tremolo',
  mixins: [midimodule],

  data: () => ({
    timerId: null,
    channel: 1,
    lfoRate: 1.0,
    gain:100,
    sampleRateInMs: 20,
    time: 0.0,
    value: 0.0,
  }),

  methods: {
    
    increment() {},
    decrement() {},

    lfo() {
      this.value = Math.sin((2.0 * Math.PI) * (this.time / 1000.0) * this.lfoRate) * 0.5 + 0.5
      this.time += this.sampleRateInMs
      this.send(MidiMessage.controlChange(this.channel - 1, 7, 127 - Math.round(this.value * 127))*this.gain)
    },

    process(data) {
      this.send(data)
      this.showIndicator()
    },

  },
  mounted() {
    this.timerId = setInterval(this.lfo, this.sampleRateInMs)
  },
  beforeDestroy() {
    clearInterval(this.timerId)
  },
}
</script>
