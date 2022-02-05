<template>
  <v-container>
    <v-card>
      <v-card-title>
        Echo
        <indicator :color="indicator.color" />
      </v-card-title>
      <v-container class="mx-2 px-4">
        <v-row>
          <v-col cols="2">
            Delay(ms)
          </v-col>
          <v-col cols="10">
            <v-slider v-model="echo[0]" min="0" max="1000" thumb-label="always">
              <template v-slot:prepend>
                <v-icon @click="decrement(0)">
                  mdi-minus
                </v-icon>
              </template>
              <template v-slot:append>
                <v-icon @click="increment(0)">
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
import toolbase from '@/mixins/toolbase'
import { Helpers } from '@/utils/helpers'
import { MidiMessage } from '@/utils/midimessage'

export default {
  name: 'Echo',
  mixins: [toolbase],
  props: {},

  data: () => ({
    echo: { 0: 0 },
  }),

  methods: {
    increment(val) {
      this.echo[val]++
    },
    decrement(val) {
      this.echo[val]--
    },

    process(data) {
      if (
        MidiMessage.is(data, MidiMessage.Channel.NOTE_ON) ||
        MidiMessage.is(data, MidiMessage.Channel.NOTE_OFF)
      ) {
        if (this.echo[0] > 0) {
          Helpers.delay(this.echo[0]).then(() => {
            this.send(data)
          })
          this.showIndicator()
        }
      }
      this.send(data)
    },
  },
}
</script>
