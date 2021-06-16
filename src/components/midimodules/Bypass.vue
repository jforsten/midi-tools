<template>
  <v-container>
    <v-card>
      <v-card-title>
        Bypass 
        <indicator :color='indicator.color' />
      </v-card-title>
      <v-container>
        <v-row>
          <v-col> </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import midimodule from '@/mixins/midimodule'
//import { MidiMessage } from '@/utils/midimessage'

export default {
  
  name: 'Bypass',
  mixins: [midimodule],
  props: {},

  data: () => ({ }),

  methods: {

    process(data) {
      this.send(data)
      this.showIndicator()
    },

  },

}
</script>
