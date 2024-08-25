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
}: {
  isPlaying: boolean
  playPause: () => void
  skipForward: () => void
  skipBackward: () => void
  backToStart: () => void
}) {
  return (
    <Box sx={{ bgcolor: 'grey.900', borderRadius: 2, width: 1 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Tooltip title="Play">
          <Button onClick={playPause}>
            {isPlaying ? (
              <PauseIcon color="warning" sx={{ fontSize: 60 }} />
            ) : (
              <PlayArrowIcon color="success" sx={{ fontSize: 60 }} />
            )}
          </Button>
        </Tooltip>

        <Tooltip title="Back to start">
          <Button onClick={backToStart}>
            <FirstPageIcon sx={{ fontSize: 60 }}>Back to Start</FirstPageIcon>{' '}
          </Button>
        </Tooltip>
        <Tooltip title="Skip back 10s">
          <Button onClick={skipBackward}>
            <FastRewindIcon sx={{ fontSize: 60 }}>Skip Backward</FastRewindIcon>
          </Button>
        </Tooltip>
        <Tooltip title="Skip forward 10s">
          <Button onClick={skipForward}>
            <FastForwardIcon sx={{ fontSize: 60 }}>
              Skip Forward
            </FastForwardIcon>
          </Button>
        </Tooltip>
      </Box>
    </Box>
  )
}
