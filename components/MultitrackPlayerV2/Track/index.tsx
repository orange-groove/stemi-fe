import React, { useEffect, useRef } from 'react'
import { Box } from '@mui/material'
import { useWavesurfer } from '@wavesurfer/react'

interface Track {
  name: string
  url: string
}

// TrackComponent
const TrackComponent = ({
  track,
  onSeek,
  registerInstance,
}: {
  track: Track
  onSeek: (time: number) => void
  registerInstance: (ws: any) => void
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { wavesurfer, isReady } = useWavesurfer({
    container: containerRef,
    url: track.url,
    waveColor: '#ccc',
    progressColor: '#007bff',
    cursorColor: '#FFAA00',
    height: 80,
    normalize: true,
    backend: 'WebAudio',
  })

  useEffect(() => {
    if (isReady && wavesurfer) {
      registerInstance(wavesurfer)
    }
  }, [isReady, wavesurfer])

  return (
    <Box sx={{ width: '100%' }}>
      {/* Waveform */}
      <Box
        ref={containerRef}
        sx={{
          width: '100%',
          height: '80px',
          border: '1px solid #ccc',
          cursor: 'pointer',
        }}
        onClick={(e) => {
          if (wavesurfer) {
            const rect = e.currentTarget.getBoundingClientRect()
            const clickX = e.clientX - rect.left
            const position = (clickX / rect.width) * wavesurfer.getDuration()
            onSeek(position)
          }
        }}
      />
    </Box>
  )
}

export default TrackComponent
