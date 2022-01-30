export const Midi = {
  midi: null,

  init(sysex = false) {
    if (Midi.midi !== null) this.close()
    return navigator
      .requestMIDIAccess({ sysex: sysex })
      .then(this.onMIDISuccess, this.onMIDIFailure)
      .then(() => this.delay(50))
  },

  close() {
    var allInputs = Midi.midi.inputs.values()
    for (
      var input = allInputs.next();
      input && !input.done;
      input = allInputs.next()
    ) {
      input.value.onmidimessage = null
    }
  },

  listInputsAndOutputs() {
    let midiAccess = Midi.midi
    for (var inp of midiAccess.inputs) {
      var input = inp[1]
      console.log(
        "Input port [type:'" +
          input.type +
          "'] id:'" +
          input.id +
          "' manufacturer:'" +
          input.manufacturer +
          "' name:'" +
          input.name +
          "' version:'" +
          input.version +
          "'"
      )
    }

    for (var outp of midiAccess.outputs) {
      var output = outp[1]
      console.log(
        "Output port [type:'" +
          output.type +
          "'] id:'" +
          output.id +
          "' manufacturer:'" +
          output.manufacturer +
          "' name:'" +
          output.name +
          "' version:'" +
          output.version +
          "'"
      )
    }
  },

  getMidiIns() {
    console.log(Array.from(Midi.midi.inputs.values()))
    return Array.from(Midi.midi.inputs.values())
  },

  getMidiOuts() {
    return Array.from(Midi.midi.outputs.values())
  },

  getOutputById(outputId) {
    return Midi.midi.outputs.get(outputId)
  },

  getInputById(inputId) {
    return Midi.midi.inputs.get(inputId)
  },

  getOutputByName(name) {
    let output = null
    Midi.midi.outputs.forEach(function(port) {
      if (port.name == name) {
        output = port
        return
      }
    })
    return output
  },

  getInputByName(name) {
    let input = null
    Midi.midi.inputs.forEach(function(port) {
      if (port.name == name) {
        input = port
        return
      }
    })
    return input
  },

  addInputListener(input, messageHandler) {
    if (input == null) {
      console.log('Midi: No input to add listener!')
      return
    }
    this.close()
    input.onmidimessage = messageHandler
    console.log('Midi: Added listener to input:' + input.name)
  },

  send(output, data) {
    output.send(data)
  },

  // Internal helpers

  onMIDISuccess(midiData) {
    Midi.midi = midiData
  },

  onMIDIFailure() {
    console.warn('Not recognizing MIDI controller')
  },

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  },
}
