<template>
  <v-container>
    <v-card>
      <v-card-title>
        Channel aftertouch to Polyphone aftertouch
      </v-card-title>
      <v-card-text>
        Process: <v-icon small :color="indicatorColor">mdi-circle</v-icon>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>

import { MidiMessage } from '@/utils/midimessage'

export default {
  name: 'PolyAftertouch',

  data: () => ({
    lastNote: null,
    indicatorColor: '#dddddd',
  }),

  methods: {
    receive(data) {
      this.process(data)
    },

    send(data) {
      this.$emit('sendMidi', data)
    },

    process(data) {

      if(MidiMessage.is(data, MidiMessage.Channel.NOTE_ON)) {    
        this.lastNote = data[1]
      }

      if (MidiMessage.is(data, MidiMessage.Channel.CHANNEL_PRESSURE)) {
        this.send(
            [
                MidiMessage.Channel.POLYPHONIC_KEY_PRESSURE + MidiMessage.getMidiChannel(data), 
                this.lastNote, 
                data[1]
            ]
        )

        this.indicatorColor = '#ff0000'
        this.delay(50).then(() => {
          this.indicatorColor = '#dddddd'
        })
      } else {
        //.. else pass through
        this.send(data)
      }
    },

    delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms))
    },
  },

  mounted() {
    this.$root.$on('onReceiveMidi', this.receive)
  },

  beforeDestroy() {
    this.$root.$off('onReceiveMidi')
  },
}
</script>
