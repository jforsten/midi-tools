<template>
  <v-container>
    <v-row align="center" justify="center" dense>
      <v-col cols="auto">
        SETTINGS
      </v-col>
      <v-spacer />
      <v-col cols="auto">
        <v-switch dense label="Debug" v-model="isMonitoring" />
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
    <v-expand-transition>
      <div v-show="isMonitoring">
        <log-viewer :log="log" />
        <v-row class="py-4">
          <v-col cols="11">
            <v-text-field
              v-model="debugSendData"
              dense
              clearable
              label="Data to send (in hex)"
              @keydown.enter.prevent="submit"
              @keydown.up.prevent="previous"
              @keydown.down.prevent="next"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-btn x-small @click="submit" fab>
              <v-icon dark>
                mdi-send
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-expand-transition>
  </v-container>
</template>

<script>
import { Midi } from '@/utils/midi'
import { Storage } from '@/utils/storage'
import { Helpers } from '@/utils/helpers'

// Modules
import PolyAftertouch from './tools/PolyAftertouch.vue'
import ChannelChange from './tools/ChannelChange.vue'
import Bypass from './tools/Bypass.vue'
import Tremolo from './tools/Tremolo.vue'
import Compressor from './tools/Compressor.vue'
import Echo from './tools/Echo.vue'
import LogViewer from '@femessage/log-viewer'

export default {
  components: {
    LogViewer,
    PolyAftertouch,
    ChannelChange,
    Bypass,
    Tremolo,
    Compressor,
    Echo,
  },
  name: 'ToolContainer',

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
    isMonitoring: false,
    log: '',
    debugSendData: null,
    previousDebugSendData: null
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
      if (this.isMonitoring) {
        this.log = this.log + 'OUT: ' + Helpers.buf2hex(data) + '\n'
      }
      Midi.send(this.output, data)
    },

    onReceiveMidi(data) {
      if (this.input == null) return
      if (this.isMonitoring) {
        this.log = this.log + 'IN:  ' + Helpers.buf2hex(data.data) + '\n'
      }
      console.log(data)
      this.$root.$emit('onReceiveMidi', data.data)
    },

    submit() {
      if (this.debugSendData == null) return

      var data = Helpers.hex2buf(this.debugSendData)

      if (data) {
        this.onSendMidi(data)
      }

      this.previousDebugSendData = this.debugSendData
      this.debugSendData = null
    },

    previous() {
      this.debugSendData = this.previousDebugSendData
    },

    next() {
            this.debugSendData = null
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
    Midi.init(true).then(() => {
      this.inputs = Midi.getMidiIns()
      this.outputs = Midi.getMidiOuts()
      this.loadSettings()
      Midi.listInputsAndOutputs()
      //this.log =
      //  'normal\x1b[30mcolor is black\x1b[0m\x1b[31;1mcolor is red and bold is true\x1b[0m\x1b[32;3mcolor is green and italic is true\x1b[0m\x1b[33;4mcolor is yellow and underline is true\x1b[0m\x1b[30;47mcolor is black and background is white\x1b[0m\x1b[30;39mcolor is reset\x1b[0m\x1b[40;49mbackground is reset\x1b[0m\x1b[1;22mbold is false\x1b[0m\x1b[3;23mitalic is false\x1b[0m\x1b[4;24munderline is false\x1b[0m'
    })
  },
}
</script>

<style scoped>
.log-viewer {
  font-family: monospace !important;
  font-size: 16px !important;
  /* background-color: rgb(107, 39, 39) !important; */
  overflow-x: auto;
  padding: 20px 0;
}
</style>
