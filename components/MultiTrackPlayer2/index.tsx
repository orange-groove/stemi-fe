import React, { useState } from 'react'
import { Box, List, ListItem, Typography } from '@mui/material'
import TransportBar from '../TransportBar'
import TrackComponent from '../Track'
import { Song } from '@/types'
import WaveSurfer from 'wavesurfer.js'

const MultiTrackPlayer = ({ song }: { song: Song }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [waveSurferInstances, setWaveSurferInstances] = useState<WaveSurfer[]>(
    [],
  )

  // Play or pause all tracks at once
  const playPause = () => {
    setIsPlaying((prevIsPlaying) => {
      if (prevIsPlaying) {
        waveSurferInstances.forEach((ws) => ws.pause())
      } else {
        waveSurferInstances.forEach((ws) => ws.play())
      }
      return !prevIsPlaying
    })
  }

  // Skip forward by a specific amount (e.g., 10 seconds)
  const skipForward = () => {
    waveSurferInstances.forEach((ws) => {
      const currentTime = ws.getCurrentTime()
      ws.setTime(currentTime + 10)
    })
  }

  // Skip backward by a specific amount (e.g., 10 seconds)
  const skipBackward = () => {
    waveSurferInstances.forEach((ws) => {
      const currentTime = ws.getCurrentTime()
      ws.setTime(Math.max(currentTime - 10, 0))
    })
  }

  // Go back to the start of all tracks
  const backToStart = () => {
    waveSurferInstances.forEach((ws) => ws.setTime(0))
    setIsPlaying(false)
  }

  const addWaveSurferInstance = (ws: WaveSurfer) => {
    setWaveSurferInstances((prev) => [...prev, ws])
  }

  return (
    <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, width: 1, p: 2 }}>
      <TransportBar
        isPlaying={isPlaying}
        backToStart={backToStart}
        playPause={playPause}
        skipBackward={skipBackward}
        skipForward={skipForward}
      />
      <List disablePadding>
        {song?.tracks?.map((track, index) => (
          <ListItem
            key={track.url}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 2,
              width: 1,
            }}
          >
            <Typography variant="subtitle1" sx={{ width: '100px' }}>
              {track.name}
            </Typography>
            <TrackComponent track={track} onReady={addWaveSurferInstance} />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default MultiTrackPlayer
