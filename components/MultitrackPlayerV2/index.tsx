import React, { useState, useEffect, useRef, useMemo } from 'react'
import * as Tone from 'tone'
import {
  Box,
  Button,
  Typography,
  Slider,
  Tooltip,
  Checkbox,
} from '@mui/material'
import TrackComponent from './components/Track'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import FirstPageIcon from '@mui/icons-material/FirstPage'
import { Track } from '@/api/client'
interface MultitrackPlayerProps {
  tracks?: Track[]
  hideDownloadButtons?: boolean
  onTracksSelected?: (selectedTracks: string[]) => void
}

const MultitrackPlayer = ({
  tracks,
  hideDownloadButtons = false,
  onTracksSelected,
}: MultitrackPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [masterVolume, setMasterVolume] = useState(1)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [zoomLevel, setZoomLevel] = useState(100) // Default zoom level (100 pixels/sec)

  const waveSurferInstances = useRef<Map<string, any>>(new Map())
  const grainPlayers = useRef<Map<string, Tone.GrainPlayer>>(new Map())
  const [volumeMap, setVolumeMap] = useState<Map<string, number>>(new Map())
  const [muteMap, setMuteMap] = useState<Map<string, boolean>>(new Map())
  const [soloMap, setSoloMap] = useState<Map<string, boolean>>(new Map())

  // Sorted display order: vocals, guitar, bass, piano, drums, other
  const displayTracks = useMemo(() => {
    if (!tracks) return []
    const order = ['vocals', 'guitar', 'bass', 'piano', 'drums']
    const getPriority = (name?: string | null) => {
      const lower = (name || '').toLowerCase()
      const idx = order.findIndex((key) => lower.includes(key))
      return idx >= 0 ? idx : order.length
    }
    return [...tracks].sort((a, b) => getPriority(a.name) - getPriority(b.name))
  }, [tracks])

  // Initialize control maps when displayTracks change
  useEffect(() => {
    const initialVolume = new Map<string, number>()
    const initialMute = new Map<string, boolean>()
    const initialSolo = new Map<string, boolean>()
    displayTracks.forEach((t) => {
      if (!t.name) return
      initialVolume.set(t.name, 1)
      initialMute.set(t.name, false)
      initialSolo.set(t.name, false)
    })
    setVolumeMap(initialVolume)
    setMuteMap(initialMute)
    setSoloMap(initialSolo)
  }, [displayTracks])

  const [selectedTracks, setSelectedTracks] = useState<string[]>([])
  const [downloadFileType, setDownloadFileType] = useState('wav')

  // Update track volumes
  const updateTrackVolumes = (
    volumeMap: Map<string, number>,
    muteMap: Map<string, boolean>,
    soloMap: Map<string, boolean>,
    masterVolume: number,
  ) => {
    const soloActive = Array.from(soloMap.values()).some((solo) => solo)

    grainPlayers.current.forEach((player, trackName) => {
      const isMuted = muteMap.get(trackName) || false
      const isSoloed = soloMap.get(trackName) || false

      let effectiveVolume = 0
      if (soloActive) {
        effectiveVolume = isSoloed
          ? volumeMap.get(trackName)! * masterVolume
          : 0
      } else {
        effectiveVolume = !isMuted
          ? volumeMap.get(trackName)! * masterVolume
          : 0
      }

      player.volume.value = Tone.gainToDb(effectiveVolume)
    })
  }

  // Handle play/pause
  const handlePlayPause = async () => {
    if (isPlaying) {
      Tone.getContext().transport.pause()
    } else {
      await Tone.start()
      Tone.getContext().transport.start()
    }
    setIsPlaying(!isPlaying)
  }

  // Seek all tracks
  const handleTrackClick = (relativeX: number) => {
    const mainTrack = waveSurferInstances.current.get(displayTracks?.[0]?.name!)
    if (!mainTrack) return

    const duration = mainTrack.getDuration()
    const clickedTime = relativeX * duration

    // Update Tone.Transport to the clicked position
    const wasPlaying = Tone.Transport.state === 'started'
    Tone.Transport.seconds = clickedTime

    // Seek all WaveSurfer instances to the clicked position
    waveSurferInstances.current.forEach((ws) => {
      ws.seekTo(relativeX)
    })

    // Restart playback if it was already playing
    if (wasPlaying) {
      Tone.Transport.start('+0.01') // Small delay to allow seek to finish
    }
  }

  // Adjust playback rate
  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate)
    grainPlayers.current.forEach((player) => (player.playbackRate = rate))
    Tone.getContext().transport.bpm.value = 120 * rate // Sync Tone.Transport
  }

  // Adjust master volume
  const handleMasterVolumeChange = (volume: number) => {
    setMasterVolume(volume)
    updateTrackVolumes(volumeMap, muteMap, soloMap, volume)
  }

  // Adjust individual track volume
  const handleTrackVolumeChange = (trackName: string, volume: number) => {
    setVolumeMap((prev) => {
      const newVolumeMap = new Map(prev).set(trackName, volume)
      updateTrackVolumes(newVolumeMap, muteMap, soloMap, masterVolume)
      return newVolumeMap
    })
  }

  // Mute a track
  const handleMute = (trackName: string) => {
    setMuteMap((prev) => {
      const newMuteMap = new Map(prev).set(
        trackName,
        !(prev.get(trackName) || false),
      )
      updateTrackVolumes(volumeMap, newMuteMap, soloMap, masterVolume)
      return newMuteMap
    })
  }

  // Solo a track
  const handleSolo = (trackName: string) => {
    setSoloMap((prev) => {
      const newSoloMap = new Map(prev).set(
        trackName,
        !(prev.get(trackName) || false),
      )
      updateTrackVolumes(volumeMap, muteMap, newSoloMap, masterVolume)
      return newSoloMap
    })
  }

  const handleBackToStartClick = () => {
    Tone.getContext().transport.stop()
    Tone.getContext().transport.position = 0
    waveSurferInstances.current.forEach((ws) => ws.seekTo(0))
    setIsPlaying(false)
  }

  const handleCheckboxChange = (trackName: string) => {
    setSelectedTracks(
      // @ts-ignore
      (prevSelectedTracks) => {
        const newSelectedTracks = prevSelectedTracks.includes(trackName)
          ? prevSelectedTracks.filter((track) => track !== trackName) // Remove if unchecked
          : [...prevSelectedTracks, trackName] // Add if checked

        // Notify parent component of selection change
        onTracksSelected?.(newSelectedTracks)
        return newSelectedTracks
      },
    )
  }

  const handleSelectAllChange = (e: any, isChecked: boolean) => {
    if (isChecked) {
      // Select all track names
      // @ts-ignore
      const allTracks = displayTracks?.map((track) => track.name) || []
      setSelectedTracks(allTracks)
      onTracksSelected?.(allTracks)
    } else {
      // Deselect all tracks
      setSelectedTracks([])
      onTracksSelected?.([])
    }
  }

  const handleScroll = (
    start: number,
    end: number,
    left: number,
    right: number,
  ) => {
    waveSurferInstances.current.forEach((ws) => {
      ws.setScroll(left)
    })
  }

  // Initialize GrainPlayers
  useEffect(() => {
    displayTracks?.forEach((track) => {
      const grainPlayer = new Tone.GrainPlayer({
        url: track.url,
        loop: false,
      }).toDestination()

      grainPlayer.sync().start(0)
      grainPlayers.current.set(track.name!, grainPlayer)
    })

    return () => {
      grainPlayers.current.forEach((player) => player.dispose())
    }
  }, [displayTracks])

  // Synchronize WaveSurfer cursor with Tone.Transport
  useEffect(() => {
    let isUserScrolling = false // Track manual scrolling

    const handlePositionUpdate = () => {
      if (!isUserScrolling) {
        const currentTime = Tone.Transport.seconds
        waveSurferInstances.current.forEach((ws) => {
          const relativePosition = currentTime / ws.getDuration()
          ws.seekTo(relativePosition) // Update WaveSurfer cursor position
        })
      }
    }

    // Use Tone.js events for playback updates
    Tone.Transport.scheduleRepeat(() => handlePositionUpdate(), 0.1) // Update every 100ms

    return () => {
      // Cleanup listeners and intervals

      Tone.Transport.cancel() // Remove all scheduled events
    }
  }, [])

  useEffect(() => {
    waveSurferInstances.current.forEach((ws) => {
      ws.zoom(zoomLevel)
    })
  }, [])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {!hideDownloadButtons && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Checkbox
              sx={{ m: 1 }}
              onChange={handleSelectAllChange}
              checked={selectedTracks.length === displayTracks?.length}
            />
            <Typography>Select All</Typography>
          </Box>
        )}

        {/* Transport and Playback Rate Controls */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            pr: 1,
            ml: 4,
          }}
        >
          <Tooltip title="Play">
            <Button onClick={handlePlayPause}>
              {isPlaying ? (
                <PauseIcon color="warning" sx={{ fontSize: 40 }} />
              ) : (
                <PlayArrowIcon color="success" sx={{ fontSize: 40 }} />
              )}
            </Button>
          </Tooltip>
          <Tooltip title="Back to start">
            <Button onClick={handleBackToStartClick}>
              <FirstPageIcon sx={{ fontSize: 40 }}>Back to Start</FirstPageIcon>
            </Button>
          </Tooltip>

          {/* <Box sx={{ ml: 2 }}>
            <Typography>Playback Rate</Typography>
            <Slider
              value={playbackRate}
              onChange={(e, value) => handlePlaybackRateChange(value as number)}
              min={0.5}
              max={2}
              step={0.01}
              sx={{
                '& .MuiSlider-thumb': {
                  height: 14,
                  width: 16,
                  backgroundColor: '#fff',
                  border: '2px solid currentColor',
                  borderRadius: 0,
                },
              }}
            />
          </Box> */}
          <Box sx={{ ml: 2 }}>
            <Typography>Master Volume</Typography>
            <Slider
              value={masterVolume}
              onChange={(e, value) => handleMasterVolumeChange(value as number)}
              min={0}
              max={1}
              step={0.01}
              sx={{
                '& .MuiSlider-thumb': {
                  height: 14,
                  width: 16,
                  backgroundColor: '#fff',
                  border: '2px solid currentColor',
                  borderRadius: 0,
                },
              }}
            />
          </Box>
        </Box>
      </Box>
      <Box sx={{ border: '1px solid #cccccc88', borderRadius: 1 }}>
        {displayTracks?.map((track, index) => (
          <Box
            key={track.name}
            sx={{ display: 'flex', width: '100%', alignItems: 'center' }}
          >
            <Checkbox
              sx={{ m: 1 }}
              onChange={() => handleCheckboxChange(track.name)}
              // @ts-ignore
              checked={selectedTracks.includes(track.name)}
            />
            <TrackComponent
              index={index}
              track={track}
              zoomLevel={zoomLevel}
              playbackRate={playbackRate}
              onClick={handleTrackClick}
              registerInstance={(ws) => {
                waveSurferInstances.current.set(track.name!, ws)
              }}
              volume={volumeMap.get(track.name!) || 1}
              masterVolume={masterVolume}
              isMuted={muteMap.get(track.name!) || false}
              isSoloed={soloMap.get(track.name!) || false}
              onVolumeChange={(volume) =>
                handleTrackVolumeChange(track.name!, volume)
              }
              onMute={() => handleMute(track.name!)}
              onSolo={() => handleSolo(track.name!)}
              onScroll={handleScroll}
            />
          </Box>
        ))}
      </Box>
      {/* Zoom Slider */}
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
        <Typography>Zoom:</Typography>
        <Slider
          value={zoomLevel}
          min={100}
          max={2000}
          step={10}
          onChange={(e, value) => setZoomLevel(value as number)}
          sx={{ ml: 2, width: 300 }}
        />
      </Box>
    </Box>
  )
}

export default MultitrackPlayer
