import React, { useState, useEffect, useRef } from 'react'
import * as Tone from 'tone'
import { Box, Button, Typography, Slider } from '@mui/material'
import TrackComponent from './Track'

interface Track {
  name: string
  url: string
}

interface MultitrackPlayerProps {
  tracks: Track[]
}

const MultitrackPlayer = ({ tracks }: MultitrackPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const waveSurferInstances = useRef<Map<string, any>>(new Map())
  const [volumeMap, setVolumeMap] = useState<Map<string, number>>(
    new Map(tracks.map((track) => [track.name, 1])),
  )
  const [masterVolume, setMasterVolume] = useState(1)
  const [muteMap, setMuteMap] = useState<Map<string, boolean>>(
    new Map(tracks.map((track) => [track.name, false])),
  )
  const [soloMap, setSoloMap] = useState<Map<string, boolean>>(
    new Map(tracks.map((track) => [track.name, false])),
  )

  // Initialize Tone.js
  useEffect(() => {
    Tone.Transport.stop()
    Tone.Transport.seconds = 0
    return () => {
      Tone.Transport.stop()
    }
  }, [])

  const handlePlayPause = async () => {
    if (isPlaying) {
      Tone.Transport.pause()
      waveSurferInstances.current.forEach((ws) => ws.pause())
    } else {
      await Tone.start()
      Tone.Transport.start()
      waveSurferInstances.current.forEach((ws) => ws.play())
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (newTime: number) => {
    Tone.Transport.seconds = newTime
    waveSurferInstances.current.forEach((ws) =>
      ws.seekTo(newTime / ws.getDuration()),
    )
  }

  const handleMasterVolumeChange = (volume: number) => {
    setMasterVolume(volume)
    updateTrackVolumes(volumeMap, muteMap, soloMap, volume)
  }

  const handleTrackVolumeChange = (trackName: string, volume: number) => {
    setVolumeMap((prev) => {
      const newVolumeMap = new Map(prev).set(trackName, volume)
      updateTrackVolumes(newVolumeMap, muteMap, soloMap, masterVolume)
      return newVolumeMap
    })
  }

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

  const updateTrackVolumes = (
    volumeMap: Map<string, number>,
    muteMap: Map<string, boolean>,
    soloMap: Map<string, boolean>,
    masterVolume: number,
  ) => {
    const soloActive = Array.from(soloMap.values()).some((solo) => solo)

    waveSurferInstances.current.forEach((ws, trackName) => {
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

      ws.setVolume(effectiveVolume)
    })
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5">Multitrack Player</Typography>

      {/* Transport and Master Volume Controls */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button variant="contained" onClick={handlePlayPause}>
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            Tone.Transport.stop()
            Tone.Transport.seconds = 0
            waveSurferInstances.current.forEach((ws) => ws.seekTo(0))
            setIsPlaying(false)
          }}
        >
          Restart
        </Button>
        <Box sx={{ ml: 2, textAlign: 'center' }}>
          <Typography>Master</Typography>
          <Slider
            value={masterVolume}
            onChange={(e, value) => handleMasterVolumeChange(value as number)}
            min={0}
            max={1}
            step={0.01}
            orientation="vertical"
            size="small"
            sx={{
              height: '50px',
              mt: 2,
              '& .MuiSlider-thumb': {
                height: 16,
                width: 14,
                backgroundColor: '#fff',
                border: '2px solid currentColor',
                '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                  boxShadow: 'inherit',
                },
                '&::before': {
                  display: 'none',
                },
                borderRadius: 0,
              },
            }}
          />
        </Box>
      </Box>

      {/* Tracks */}
      <Box sx={{ border: '1px solid #ccc' }}>
        {tracks.map((track) => (
          <Box
            key={track.name}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              '&:not(:last-of-type)': {
                borderBottom: '1px solid #ccc',
              },
            }}
          >
            <TrackComponent
              track={track}
              onSeek={handleSeek}
              registerInstance={(ws) => {
                waveSurferInstances.current.set(track.name, ws)
              }}
              volume={volumeMap.get(track.name) || 1}
              masterVolume={masterVolume}
              isMuted={muteMap.get(track.name) || false}
              isSoloed={soloMap.get(track.name) || false}
              onVolumeChange={(volume) =>
                handleTrackVolumeChange(track.name, volume)
              }
              onMute={() => handleMute(track.name)}
              onSolo={() => handleSolo(track.name)}
            />
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default MultitrackPlayer
