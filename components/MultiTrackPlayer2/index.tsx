import React, { useEffect, useState } from 'react'
import { Box, List, ListItem, Typography } from '@mui/material'
import TransportBar from '../TransportBar'
import TrackComponent from '../Track'
import { Song } from '@/types'
import WaveSurfer from 'wavesurfer.js'
import KeySignatureBar from '../KeySignatureBar'

const MultiTrackPlayer = ({ song }: { song: Song }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [waveSurferInstances, setWaveSurferInstances] = useState<WaveSurfer[]>(
    [],
  )
  const [syncPosition, setSyncPosition] = useState(0)

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

  const handleTrackClick = (position) => {
    setSyncPosition(position)
    waveSurferInstances.forEach((ws) => {
      ws.setTime(position)
    })
  }

  useEffect(() => {
    if (isPlaying) {
      waveSurferInstances.forEach((ws) => ws.play())
    } else {
      waveSurferInstances.forEach((ws) => ws.pause())
    }
  }, [isPlaying, waveSurferInstances])

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

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        bgcolor: 'background.paper',
        borderRadius: 2,
        width: 1,
        p: 2,
      }}
    >
      <TransportBar
        isPlaying={isPlaying}
        backToStart={backToStart}
        playPause={playPause}
        skipBackward={skipBackward}
        skipForward={skipForward}
        ws={waveSurferInstances}
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
            <TrackComponent
              track={track}
              onReady={addWaveSurferInstance}
              onClick={handleTrackClick}
            />
          </ListItem>
        ))}
      </List>
      <KeySignatureBar
        ws={waveSurferInstances[0]}
        keyChanges={song?.keyChanges}
        tempoChanges={song?.tempoChanges}
      />
    </Box>
  )
}

export default MultiTrackPlayer
