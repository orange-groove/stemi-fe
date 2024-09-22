import { TempoChange } from '@/types'
import { Box, Typography } from '@mui/material'
import { useEffect, useRef } from 'react'
import WaveSurfer from 'wavesurfer.js'

interface Props {
  ws: WaveSurfer
  tempoChanges?: TempoChange[]
}

export default function TempoBar({ ws, tempoChanges }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateCurrentTime = () => {
      const currentTime = ws?.getCurrentTime()

      const tempo = tempoChanges?.[0]?.tempo || 120 // Default tempo if not provided
      const beatInterval = 60 / tempo
      const beat = Math.floor(currentTime / beatInterval)
      const currentTempo = tempoChanges?.[beat]
      if (containerRef.current && currentTempo) {
        containerRef.current.innerHTML = `${currentTempo} BPM`
      }
    }

    if (ws) {
      ws.on('audioprocess', updateCurrentTime)
    }

    return () => {
      if (ws) {
        ws.un('audioprocess', updateCurrentTime)
      }
    }
  }, [ws, tempoChanges])

  return (
    <Box>
      <Typography variant="h6">Tempo</Typography>
      <Box
        ref={containerRef}
        sx={{
          display: 'flex',
          gap: 2,
          alignItems: 'center',
        }}
      />
    </Box>
  )
}
