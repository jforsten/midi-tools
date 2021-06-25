


export const Midi = {
  midi: null,

  init ( sysex = false) {
      if (Midi.midi !== null) this.close()
      return navigator.requestMIDIAccess({ sysex: sysex })
      .then(this.onMIDISuccess, this.onMIDIFailure)
      .then(() => this.delay(50))
  },
      
  close () {
      var allInputs = Midi.midi.inputs.values()
      for (var input = allInputs.next(); input && !input.done; input = allInputs.next()) {
        input.value.onmidimessage = null
      }
    },

  getMidiIns () {     
    console.log(Midi.midi.inputs.values())

    return Array.from( Midi.midi.inputs.values() )
    },
    
  getMidiOuts () {
    return Array.from ( Midi.midi.outputs.values() )
  },

  getOutputById (outputId) {
    return Midi.midi.outputs.get(outputId)
  },
  
   getInputById (inputId) {
    return Midi.midi.inputs.get(inputId)
  },

  getOutputByName (name) {
    let output = null
    Midi.midi.outputs.forEach( function( port ) {
      if(port.name == name ) { 
        output = port
        return
      }
    })
    return output
  },
  
   getInputByName (name) {
    let input = null
    Midi.midi.inputs.forEach( function( port ) {
      if(port.name == name ) { 
        input = port
        return
      }
    })
    return input
  },
  
  addInputListener (input, messageHandler) {
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

  onMIDISuccess (midiData) {      
    Midi.midi = midiData
  },

  onMIDIFailure () {
      console.warn('Not recognizing MIDI controller')
  },

  delay (ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
  },

  

}

