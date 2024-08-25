import MultiTrackPlayer from 'wavesurfer-multitrack'
import { useEffect, useRef, useState } from 'react'

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
    { id: number; volume: number; name: string }[]
  >([])

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
            height: 100,
            normalize: true,
          },
          startPosition: 0,
        })),
        {
          container: containerRef.current,
          minPxPerSec: 10,
          cursorWidth: 2,
          trackBackground: '#2D2D2D',
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

      multitrack.on('ready', () => {
        setIsPlaying(false)
      })

      // Clean up on unmount
      return () => {
        if (multitrackRef.current) {
          multitrackRef.current.destroy()
        }
      }
    }
  }, [urls])

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

  const addTrack = (url) => {
    const trackId = multitrackRef.current.tracks.length // New track ID

    const track = {
      id: trackId,
      url,
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

    setTrackMetadata((prev) =>
      prev.map((track) =>
        track.id === trackId
          ? {
              ...track,
              ...{
                id: trackId,
                url,
                draggable: true,
                volume: 1,
                options: {
                  waveColor: 'rgba(255, 123, 0, 0.5)',
                  progressColor: 'rgba(255, 123, 0, 1)',
                  cursorColor: '#D72F21',
                  height: 80,
                  normalize: true,
                },
              },
            }
          : track,
      ),
    )
  }

  return {
    containerRef,
    isPlaying,
    playPause,
    muteTrack,
    unmuteTrack,
    isTrackMuted,
    trackMetadata,
    addTrack,
  }
}

export default useMultiTrackPlayer
