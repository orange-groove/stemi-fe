import React, { useState, useEffect, useRef } from 'react'
import * as Tone from 'tone'
import { Box, Button, Typography, List, ListItem } from '@mui/material'
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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5">Multitrack Player</Typography>

      {/* Transport Controls */}
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
      </Box>

      {/* Tracks */}
      <List>
        {tracks.map((track) => (
          <ListItem
            key={track.name}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              mb: 2,
            }}
          >
            <Typography>{track.name}</Typography>
            <TrackComponent
              track={track}
              onSeek={handleSeek}
              registerInstance={(ws) => {
                waveSurferInstances.current.set(track.name, ws)
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default MultitrackPlayer
