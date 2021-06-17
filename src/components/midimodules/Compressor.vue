<template>
  <v-container>
    <v-card>
      <v-container>
        <v-row>
          <v-col min-width="200" cols="4">
            <v-card color="grey lighten-2">
              <v-sparkline height="250" :value="values" line-width="3" />
            </v-card>
          </v-col>
          <v-col>
            <v-row>
              <v-col>
                <v-slider label="Gain"  thumb-label="always" v-model="offset" min="-127" max="127" />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-slider label="Scale" thumb-label="always" v-model="scale" min="0" max="10" step="0.05" />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-slider label="Threshold" thumb-label="always" v-model="threshold" min="0" max="127" />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import midimodule from '@/mixins/midimodule'

export default {
  name: 'Compressor',
  mixins: [midimodule],

  data: () => ({
    offset: 0,
    scale: 1,
    threshold: 0
  }),
  computed: {
    values: {
      get: function() {
        let val = [0]
        for (let i = 0; i < 128; i++) {
          let tmpScale = this.scale
          let extraOffset = (1.0 - this.scale) * this.threshold
          if(i<this.threshold) {
              tmpScale = 1
              extraOffset = 0
          }
          let v = i * tmpScale + this.offset + extraOffset

          if (v > 127) {
            v = 127
          }
          if (v < 0) {
            v = 0
          }

          val.push(v)
        }
        val.push(127)
        return val
      },
    },
  },
  methods: {},
}
</script>
