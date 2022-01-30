<template>
  <v-container>
    <v-row class="">
      <v-col>
        SETTINGS
      </v-col>
    </v-row>
    <v-row dense align="center">
      <v-col cols="6" sm="4">
        <v-select
          label="MIDI input"
          v-model="selectedInput"
          :items="inputs"
          item-text="name"
          item-value="id"
          prepend-inner-icon="mdi-midi-port"
        />
      </v-col>
      <v-col cols="auto" class="ms-6">
        <v-icon large>mdi-transfer-right</v-icon>
      </v-col>
      <v-col cols="3" sm="2" class="mx-auto">
        <v-select
          class="mt-8"
          label="Tool"
          v-model="selectedToolView"
          :items="toolList"
          item-text="name"
          item-value="component"
          prepend-inner-icon="mdi-wrench"
          solo
        />
      </v-col>
       <v-col cols="auto" class="me-6">
        <v-icon large>mdi-transfer-right</v-icon>
      </v-col>

      <v-col cols="6" sm="4">
        <v-select
          label="MIDI output"
          v-model="selectedOutput"
          :items="outputs"
          item-text="name"
          item-value="id"
          prepend-inner-icon="mdi-midi-port"
        />
      </v-col>
    </v-row>
    <v-row class="">
      <v-col>
        SELECTED TOOL
      </v-col>
    </v-row>
    <component class="mt-5 px-0" @sendMidi="onSendMidi" :is="toolView" />
  </v-container>
</template>

<script>
import { Midi } from '@/utils/midi'
import { Storage } from '@/utils/storage'

// Modules
import PolyAftertouch from './midimodules/PolyAftertouch.vue'
import ChannelChange from './midimodules/ChannelChange.vue'
import Bypass from './midimodules/Bypass.vue'
import Tremolo from './midimodules/Tremolo.vue'
import Compressor from './midimodules/Compressor.vue'
import Echo from './midimodules/Echo.vue'

export default {
  components: {
    PolyAftertouch,
    ChannelChange,
    Bypass,
    Tremolo,
    Compressor,
    Echo,
  },
  name: 'Container',

  data: () => ({
    inputs: [],
    input: null,
    outputs: [],
    output: null,
    toolList: [
      { name: 'Bypass', component: 'Bypass' },
      { name: 'Aftertouch', component: 'PolyAftertouch' },
      { name: 'Channel', component: 'ChannelChange' },
      { name: 'Tremolo', component: 'Tremolo' },
      { name: 'Compressor', component: 'Compressor' },
      { name: 'Echo', component: 'Echo' },
    ],
    toolView: 'Bypass',
  }),

  computed: {
    selectedInput: {
      get: function() {
        return this.input
      },
      set: function(newValue) {
        this.input = Midi.getInputById(newValue)
        Midi.addInputListener(this.input, this.onReceiveMidi)
        console.warn(this.input)
        this.saveSettings()
      },
    },
    selectedOutput: {
      get: function() {
        return this.output
      },
      set: function(newValue) {
        this.output = Midi.getOutputById(newValue)
        console.warn(this.output)
        this.saveSettings()
      },
    },
    selectedToolView: {
      get: function() {
        return this.toolView
      },
      set: function(newValue) {
        this.toolView = newValue
        this.saveSettings()
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

    saveSettings() {
      let inputName = null
      let outputName = null

      if (this.input) {
        inputName = this.input.name
      }
      if (this.output) {
        outputName = this.output.name
      }

      let ports = {
        inputName: inputName,
        outputName: outputName,
        tool: this.toolView,
      }

      Storage.save('midi-tools-settings', ports)
    },

    loadSettings() {
      let settings = Storage.load('midi-tools-settings')

      if (settings == null) {
        return
      }

      this.input = Midi.getInputByName(settings.inputName)
      Midi.addInputListener(this.input, this.onReceiveMidi)
      this.output = Midi.getOutputByName(settings.outputName)
      this.toolView = settings.tool
    },
  },

  mounted() {
    Midi.init().then(() => {
      this.inputs = Midi.getMidiIns()
      this.outputs = Midi.getMidiOuts()
      this.loadSettings()
      Midi.listInputsAndOutputs()
    })
  },
}
</script>
