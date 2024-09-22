import React, { useEffect, useRef, useState } from 'react'
import { useWavesurfer } from '@wavesurfer/react'
import { Box, Typography } from '@mui/material'
import theme from '@/theme'

interface TrackComponentProps {
  track: { name: string; url: string }
  onReady?: (wavesurfer: any) => void
  onClick: (position: number) => void
}

export default function TrackComponent({
  track,
  onReady,
  onClick,
}: TrackComponentProps) {
  const containerRef = useRef(null)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1) // Default volume is 1 (max)

  const { wavesurfer, isReady } = useWavesurfer({
    container: containerRef,
    url: track.url,
    waveColor: theme.palette.primary.main,
    progressColor: 'darkgray',
    cursorColor: '#FEED59',
    cursorWidth: 2,
    barWidth: 2,
    height: 100,
    normalize: true,
    backend: 'WebAudio',
  })

  useEffect(() => {
    if (isReady && wavesurfer && typeof onReady === 'function') {
      onReady(wavesurfer)
    }
  }, [isReady, wavesurfer])

  useEffect(() => {
    if (wavesurfer) {
      wavesurfer.setVolume(isMuted ? 0 : volume)
    }
  }, [isMuted, volume, wavesurfer])

  const toggleMute = () => {
    setIsMuted((prev) => !prev)
  }

  const handleClick = (event: any) => {
    if (wavesurfer) {
      const position =
        (event.nativeEvent.offsetX / event.currentTarget.clientWidth) *
        wavesurfer.getDuration()
      wavesurfer.seekTo(position / wavesurfer.getDuration())
      onClick(position)
    }
  }

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        width: 1,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Box sx={{ bgcolor: 'background.paper', height: '100px', p: 1 }}>
        <Typography
          variant="subtitle1"
          sx={{ width: '100px', color: 'secondary.main' }}
        >
          {track.name}
        </Typography>
        <Box
          onClick={toggleMute}
          sx={{
            cursor: 'pointer',
            color: isMuted ? 'red' : 'primary',
          }}
        >
          M
        </Box>
      </Box>
      <Box
        ref={containerRef}
        onClick={handleClick}
        sx={{
          flexGrow: 1,
          borderLeft: '1px solid lightgrey',
        }}
      />
    </Box>
  )
}
