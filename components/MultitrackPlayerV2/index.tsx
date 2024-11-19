import React, { useState, useEffect, useRef } from 'react'
import * as Tone from 'tone'
import { Box, Button, Typography, List, ListItem, Slider } from '@mui/material'
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
    waveSurferInstances.current.forEach((ws) => ws.setVolume(volume))
  }

  const handleTrackVolumeChange = (trackName: string, volume: number) => {
    setVolumeMap((prev) => new Map(prev).set(trackName, volume))
    const waveSurfer = waveSurferInstances.current.get(trackName)
    if (waveSurfer) {
      waveSurfer.setVolume(volume * masterVolume)
    }
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
            sx={{ height: '50px', mt: 2 }}
          />
        </Box>
      </Box>

      {/* Tracks */}
      <Box>
        {tracks.map((track) => (
          <Box
            key={track.name}
            sx={{
              display: 'flex',
              flexDirection: 'column',
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
              onVolumeChange={(volume) =>
                handleTrackVolumeChange(track.name, volume)
              }
            />
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default MultitrackPlayer
