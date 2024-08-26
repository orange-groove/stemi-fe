import { Box, Button, Tooltip } from '@mui/material'

import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import FastForwardIcon from '@mui/icons-material/FastForward'
import FastRewindIcon from '@mui/icons-material/FastRewind'
import FirstPageIcon from '@mui/icons-material/FirstPage'

export default function TransportBar({
  isPlaying,
  playPause,
  skipForward,
  skipBackward,
  backToStart,
  variant = 'small',
}: {
  isPlaying: boolean
  playPause: () => void
  skipForward: () => void
  skipBackward: () => void
  backToStart: () => void
  variant?: 'small' | 'large'
}) {
  const iconSize = variant === 'large' ? 80 : 40

  return (
    <Box sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
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
    </Box>
  )
}
