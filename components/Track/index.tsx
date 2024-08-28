import React, { useEffect, useRef, useState } from 'react'
import { useWavesurfer } from '@wavesurfer/react'
import { Box, Button, Typography } from '@mui/material'

export default function TrackComponent({ track, onReady, onClick }) {
  const containerRef = useRef(null)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1) // Default volume is 1 (max)

  const { wavesurfer, isReady } = useWavesurfer({
    container: containerRef,
    url: track.url,
    waveColor: 'lightgrey',
    progressColor: 'rgb(100, 0, 100)',
    height: 40,
    barHeight: 50,
    normalize: true,
    backend: 'WebAudio',
  })

  useEffect(() => {
    if (isReady && wavesurfer && typeof onReady === 'function') {
      onReady(wavesurfer)
    }
  }, [isReady, wavesurfer, onReady])

  useEffect(() => {
    if (wavesurfer) {
      wavesurfer.setVolume(isMuted ? 0 : volume)
    }
  }, [isMuted, volume, wavesurfer])

  const toggleMute = () => {
    setIsMuted((prev) => !prev)
  }

  const handleClick = (event) => {
    const position =
      (event.nativeEvent.offsetX / event.currentTarget.clientWidth) *
      wavesurfer.getDuration()
    if (wavesurfer) {
      wavesurfer.seekTo(position / wavesurfer.getDuration())
      onClick(position)
    }
  }

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 2,
        width: 1,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{ width: '100px', color: 'secondary.main' }}
      >
        {track.name}
      </Typography>
      <Button onClick={toggleMute}>{isMuted ? 'Unmute' : 'Mute'}</Button>
      <Box ref={containerRef} onClick={handleClick} sx={{ flexGrow: 1 }} />
    </Box>
  )
}
