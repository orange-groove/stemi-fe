import React, { useEffect, useRef } from 'react'
import { useWavesurfer } from '@wavesurfer/react'
import { Box } from '@mui/material'

export default function TrackComponent({ track, onReady }) {
  const containerRef = useRef(null)

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
  }, [isReady, wavesurfer])

  return (
    <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, width: 1 }}>
      <div ref={containerRef} />
    </Box>
  )
}
