<template>
  <v-container>
    <v-card>
      <v-card-title>
        Channel to Polyphonic aftertouch
        <indicator :color="indicator.color" />
      </v-card-title>
    </v-card>
  </v-container>
</template>

<script>
import toolbase from '@/mixins/toolbase'
import { MidiMessage } from '@/utils/midimessage'

export default {
  name: 'PolyAftertouch',
  mixins: [toolbase],

  data: () => ({
    lastNote: null,
  }),

  methods: {
   
    process(data) {
      if (MidiMessage.is(data, MidiMessage.Channel.NOTE_ON)) {
        this.lastNote = data[1]
      }

      if (MidiMessage.is(data, MidiMessage.Channel.CHANNEL_PRESSURE)) {
        this.send([
          MidiMessage.Channel.POLYPHONIC_KEY_PRESSURE +
            MidiMessage.getMidiChannel(data),
          this.lastNote,
          data[1],
        ])

       this.showIndicator()
      } else {
        //.. else pass through
        this.send(data)
      }
    },   
  },

}
</script>
