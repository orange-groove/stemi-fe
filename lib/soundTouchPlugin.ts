import { SoundTouch } from 'soundtouch'

// Create a custom WaveSurfer plugin for Time Stretching
export const soundTouchPlugin = () => {
  return {
    name: 'soundTouch',

    // The init method will be called once the WaveSurfer instance is ready
    init: (waveSurfer: any) => {
      this.ws = waveSurfer
      this.soundTouch = new SoundTouch() // Assuming you've loaded SoundTouch.js

      // You can set initial values for tempo and pitch adjustments here
      this.soundTouch.setTempoChange(0) // Default to no tempo change (keep pitch)
    },

    // Set playback rate via SoundTouch for time-stretching
    setPlaybackRate: (rate: number) => {
      this.soundTouch.setTempoChange(rate - 1) // Convert rate to tempo change
      this.ws.backend.setPlaybackRate(1) // Disable native rate change, use SoundTouch
    },

    // Hook into the play method to apply time-stretching on play
    play: () => {
      const buffer = this.ws.backend.buffer
      const audioContext = this.ws.backend.ac
      const source = audioContext.createBufferSource()
      source.buffer = buffer

      // Apply time-stretching with SoundTouch
      this.soundTouch.apply(source.buffer, buffer.duration, 0) // Apply stretching here
      source.connect(this.ws.backend.analyser)
      source.connect(audioContext.destination)
      source.start(0)
    },
  }
}
