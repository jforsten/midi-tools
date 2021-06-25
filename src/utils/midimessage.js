export const MidiMessage = { 
    // MIDI Message types

  Channel: { 
    NOTE_OFF: 0x80,
    NOTE_ON: 0x90,
    POLYPHONIC_KEY_PRESSURE: 0xA0,
    CONTROL_CHANGE: 0xB0,
    PROGRAM_CHANGE: 0xC0,
    CHANNEL_PRESSURE: 0xD0,
    PITCH_BEND: 0xE0
  }, 

  System: {

  },
  
  getExactType(midiData) {
    return midiData[0] & 0xF0
  },

  isChannelType(midiData) {
    return (midiData[0] >= 0x80 && midiData[0] < 0xF0)
  },

  getMidiChannel(midiData) {
    return midiData[0] & 0x0F
  },

  is(midiData, type) {
    return this.getExactType(midiData) == type
  },

  controlChange(channel, control, value) {
    return [this.Channel.CONTROL_CHANGE + channel, control, value]
  }
}