import { Box, Button, Tooltip } from '@mui/material'

import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import FastForwardIcon from '@mui/icons-material/FastForward'
import FastRewindIcon from '@mui/icons-material/FastRewind'
import FirstPageIcon from '@mui/icons-material/FirstPage'
import { useEffect, useRef } from 'react'
import WaveSurfer from 'wavesurfer.js'
import PlaybackRateSlider from '../PlaybackRateSlider'

export default function TransportBar({
  isPlaying,
  playPause,
  skipForward,
  skipBackward,
  backToStart,
  variant = 'small',
  ws,
}: {
  isPlaying: boolean
  playPause: () => void
  skipForward: () => void
  skipBackward: () => void
  backToStart: () => void
  variant?: 'small' | 'large'
  ws: WaveSurfer[]
}) {
  const timeDisplayRef = useRef<HTMLDivElement>(null)

  const iconSize = variant === 'large' ? 80 : 40

  useEffect(() => {
    const updateCurrentTime = () => {
      const currentTime = ws[0]?.getCurrentTime() || 0

      if (timeDisplayRef.current) {
        timeDisplayRef.current.textContent = `${currentTime.toFixed(2)}s`
      }
    }

    if (ws) {
      //test
      ws[0]?.on('audioprocess', updateCurrentTime)
    }

    return () => {
      if (ws[0]) {
        ws[0]?.un('audioprocess', updateCurrentTime)
      }
    }
  }, [ws])

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        bgcolor: 'background.paper',
        borderRadius: 2,
        height: '50px',
      }}
    >
      <Box>
        <Tooltip title="Play">
          <Button onClick={playPause}>
            {isPlaying ? (
              <PauseIcon color="warning" sx={{ fontSize: iconSize }} />
            ) : (
              <PlayArrowIcon color="success" sx={{ fontSize: iconSize }} />
            )}
          </Button>
        </Tooltip>

        <Tooltip title="Back to start">
          <Button onClick={backToStart}>
            <FirstPageIcon sx={{ fontSize: iconSize }}>
              Back to Start
            </FirstPageIcon>{' '}
          </Button>
        </Tooltip>
        <Tooltip title="Skip back 10s">
          <Button onClick={skipBackward}>
            <FastRewindIcon sx={{ fontSize: iconSize }}>
              Skip Backward
            </FastRewindIcon>
          </Button>
        </Tooltip>
        <Tooltip title="Skip forward 10s">
          <Button onClick={skipForward}>
            <FastForwardIcon sx={{ fontSize: iconSize }}>
              Skip Forward
            </FastForwardIcon>
          </Button>
        </Tooltip>
      </Box>
      <Tooltip title="Time display">
        <Box sx={{ width: '75px' }}>
          <Box>Time</Box>
          <Box ref={timeDisplayRef} sx={{ cursor: 'pointer' }}>
            0.00s
          </Box>
        </Box>
      </Tooltip>
      <Tooltip title="Change playback speed">
        <PlaybackRateSlider ws={ws} />
      </Tooltip>
    </Box>
  )
}
