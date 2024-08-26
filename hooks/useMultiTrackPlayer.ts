import MultiTrackPlayer from 'wavesurfer-multitrack'
import { useEffect, useRef, useState } from 'react'
import { useColorMode } from '@/components/AppThemeProvider'
import Hover from 'wavesurfer.js/dist/plugins/hover.esm.js'
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js'

const colors = [
  'rgba(0, 123, 255, 0.5)',
  'rgba(255, 0, 0, 0.5)',
  'rgba(0, 255, 0, 0.5)',
  'rgba(255, 255, 0, 0.5)',
  'rgba(255, 0, 255, 0.5)',
  'rgba(0, 255, 255, 0.5)',
]

const useMultiTrackPlayer = (urls: string[]) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const multitrackRef = useRef<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [trackMetadata, setTrackMetadata] = useState<
    {
      id: number
      volume: number
      name: string
      startPosition: number
      url: string
    }[]
  >([])
  const [recordingWaveSurfer, setRecordingWaveSurfer] = useState(null)

  const colorMode = useColorMode()

  useEffect(() => {
    if (containerRef.current) {
      // Create a canvas gradient
      const ctx = document.createElement('canvas').getContext('2d')
      const gradient = ctx?.createLinearGradient(0, 0, 0, 150)
      gradient?.addColorStop(0, 'rgb(200, 0, 200)')
      gradient?.addColorStop(0.7, 'rgb(100, 0, 100)')
      gradient?.addColorStop(1, 'rgb(0, 0, 0)')

      const multitrack = MultiTrackPlayer.create(
        urls.map((url, index) => ({
          id: index,
          url,
          draggable: true,
          volume: 1, // Default volume set to 1
          options: {
            barWidth: 2,
            waveColor: colors[index % colors.length],
            progressColor: colors[index % colors.length],
            cursorColor: 'rgb(255, 105, 180, 1)',
            height: 150,
            normalize: true,
          },
          startPosition: 0,
          draggable: false,
          plugins: [
            Hover.create({
              lineColor: '#ff0000',
              lineWidth: 2,
              labelBackground: '#555',
              labelColor: '#fff',
              labelSize: '11px',
            }),
            RecordPlugin.create({
              scrollingWaveform: true,
              renderRecordedAudio: true,
            }),
          ],
        })),
        {
          container: containerRef.current,
          minPxPerSec: 10,
          cursorWidth: 2,
          trackBackground: colorMode.mode === 'dark' ? '#2D2D2D' : '#F5F5F5',
          trackBorderColor: '#7C7C7C',
        },
      )

      multitrackRef.current = multitrack

      // Initialize track metadata
      const initialMetadata = urls.map((url, index) => ({
        id: index,
        volume: 1, // Default volume for each track
        name: url.split('/').pop()?.split('.').shift() || `Track ${index + 1}`, // Default name for each track
      }))
      setTrackMetadata(initialMetadata)

      multitrack.on('interaction', () => {
        multitrack.play()
      })

      // Clean up on unmount
      return () => {
        if (multitrackRef.current) {
          multitrackRef.current.destroy()
        }

        multitrack.unAll()
      }
    }
  }, [urls, colorMode.mode])

  // Transport controls
  const playPause = () => {
    if (multitrackRef.current) {
      if (isPlaying) {
        multitrackRef.current.pause()
        setIsPlaying(false)
      } else {
        multitrackRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const skipForward = () => {
    if (multitrackRef?.current) {
      const currentTime = multitrackRef.current.getCurrentTime()
      if (isFinite(currentTime)) {
        multitrackRef.current.setTime(currentTime + 10)
      } else {
        console.error('Invalid current time:', currentTime)
      }
    }
  }

  const skipBackward = () => {
    if (multitrackRef?.current) {
      const currentTime = multitrackRef.current.getCurrentTime()
      if (isFinite(currentTime)) {
        multitrackRef.current.setTime(Math.max(currentTime - 10))
      } else {
        console.error('Invalid current time:', currentTime)
      }
    }
  }

  const backToStart = () => {
    if (multitrackRef?.current) {
      multitrackRef.current.setTime(0)
    }
  }

  const muteTrack = (trackId: number) => {
    if (multitrackRef.current) {
      multitrackRef.current.setTrackVolume(trackId, 0)
      setTrackMetadata((prev) =>
        prev.map((track) =>
          track.id === trackId ? { ...track, volume: 0 } : track,
        ),
      )
    }
  }

  const unmuteTrack = (trackId: number) => {
    if (multitrackRef.current) {
      multitrackRef.current.setTrackVolume(trackId, 1) // Restore volume to 1 (full volume)
      setTrackMetadata((prev) =>
        prev.map((track) =>
          track.id === trackId ? { ...track, volume: 1 } : track,
        ),
      )
    }
  }

  const isTrackMuted = (trackId: number) => {
    const track = trackMetadata.find((track) => track.id === trackId)
    return track ? track.volume === 0 : false
  }

  const addBlankTrack = (trackName, startPosition) => {
    const track = {
      id: trackMetadata.length,
      url: '', // Placeholder, no URL yet
      startPosition: startPosition || 0,
      draggable: true,
      volume: 1,
      options: {
        waveColor: 'rgba(255, 123, 0, 0.5)',
        progressColor: 'rgba(255, 123, 0, 1)',
        cursorColor: '#D72F21',
        height: 80,
        normalize: true,
      },
    }
    multitrackRef.current.addTrack(track)
    setTrackMetadata((prev) => [...prev, { name: trackName, ...track }])
  }

  const getCurrentTime = () => {
    return multitrackRef.current ? multitrackRef.current.getCurrentTime() : 0
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'Space') {
        event.preventDefault() // Prevent default spacebar scrolling behavior
        playPause()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    // Cleanup the event listener on unmount
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [playPause])

  return {
    containerRef,
    multitrackRef,
    isPlaying,
    trackMetadata,
    playPause,
    skipForward,
    skipBackward,
    backToStart,
    muteTrack,
    unmuteTrack,
    isTrackMuted,
    setTrackMetadata,
    getCurrentTime,
    addBlankTrack,
    startRecording: (deviceId) => {
      if (recordingWaveSurfer) {
        recordingWaveSurfer.plugins.record.startRecording({ deviceId })
      }
    },
    stopRecording: (callback) => {
      if (recordingWaveSurfer) {
        recordingWaveSurfer.plugins.record.stopRecording()
        recordingWaveSurfer.on('record-end', (blob) => {
          callback(blob)
        })
      }
    },
  }
}

export default useMultiTrackPlayer
