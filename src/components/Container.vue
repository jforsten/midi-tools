<template>
  <v-container>
    <v-row class="">
      <v-col>
        SETTINGS
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="4">
        <v-select
          label="MIDI input"
          v-model="selectedInput"
          :items="inputs"
          item-text="name"
          return-object
          prepend-icon="mdi-midi-port"
        />
      </v-col>
      <v-col cols="4">
        <v-select
          label="MIDI output"
          v-model="output"
          :items="outputs"
          item-text="name"
          return-object
          prepend-icon="mdi-midi-port"
        />
      </v-col>
      <v-col cols="4">
        <v-select
          label="Tool"
          v-model="fxView"
          :items="fxList"
          item-text="name"
          item-value="component"
          prepend-icon="mdi-wrench"
        />
      </v-col>
    </v-row>
    <v-row class="">
      <v-col>
        SELECTED TOOL
      </v-col>
    </v-row>

    <component class="mt-5 px-0" @sendMidi="onSendMidi" :is="fxView" />
  </v-container>
</template>

<script>
import { Midi } from '@/utils/midi'
import PolyAftertouch from './midimodules/PolyAftertouch.vue'
import ChannelChange from './midimodules/ChannelChange.vue'
import Bypass from './midimodules/Bypass.vue'

export default {
  components: { PolyAftertouch, ChannelChange, Bypass},
  name: 'Container',

  data: () => ({
    inputs: [],
    input: null,
    outputs: [],
    output: null,
    fxList: [
      { name: 'Bypass', component: 'Bypass' },
      { name: 'Aftertouch Converter', component: 'PolyAftertouch' },
      { name: 'Channel changer', component: 'ChannelChange' }
    ],
    fx: null,
    fxView: 'Bypass',
  }),

  computed: {
    selectedInput: {
      get: function() {
        return this.input
      },
      set: function(newValue) {
        this.input = newValue
        Midi.addInputListener(this.input, this.onReceiveMidi)
      },
    },
  },

  methods: {
    onSendMidi(data) {
      if (this.output == null) return
      Midi.send(this.output, data)
    },

    onReceiveMidi(data) {
      if (this.input == null) return
      this.$root.$emit('onReceiveMidi', data.data)
    },
  },

  mounted() {
    Midi.init().then(() => {
      this.inputs = Midi.getMidiIns()
      this.outputs = Midi.getMidiOuts()
    })
  },
}
</script>
