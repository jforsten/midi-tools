<template>
  <v-container>
    <v-card>
      <v-card-title>
        MIDI channel changer
        <indicator :color="indicator.color" />
      </v-card-title>
      <v-container>
        <v-row class="pt-7 justify-center">
          
          <v-col cols="4">
            <v-slider v-model="from" min="1" max="16" thumb-label="always">
              <template v-slot:prepend>
                <v-icon @click="decrementFrom">
                  mdi-minus
                </v-icon>
              </template>
              <template v-slot:append>
                <v-icon @click="incrementFrom">
                  mdi-plus
                </v-icon>
              </template>
            </v-slider>
          </v-col>

          <v-col cols="auto" class="mx-8 px-8">
            <v-icon>
              mdi-shuffle-variant
            </v-icon>
          </v-col>

          <v-col cols="4">
            <v-slider v-model="to" min="1" max="16" thumb-label="always">
              <template v-slot:prepend>
                <v-icon @click="decrementTo">
                  mdi-minus
                </v-icon>
              </template>
              <template v-slot:append>
                <v-icon @click="incrementTo">
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
  name: 'ChannelChange',
  mixins: [midimodule],
  props: {},
  data: () => ({
    from: 1,
    to: 1,
  }),
  methods: {
    incrementFrom() {
      this.from++
    },
    decrementFrom() {
      this.from--
    },
    incrementTo() {
      this.to++
    },
    decrementTo() {
      this.to--
    },

    process(data) {
      if (
        MidiMessage.isChannelType(data) &&
        MidiMessage.getMidiChannel(data) == this.from - 1
      ) {
        let newStatus = (data[0] & 0xf0) + (this.to - 1)
        data[0] = newStatus
        this.send(data)

        this.showIndicator()
      } else {
        this.send(data)
      }
    },
  },
}
</script>
