'use client'

import type { Track } from '@/types'
import { Box } from '@mui/material'
import { useWavesurfer } from '@wavesurfer/react'
import { useRef } from 'react'

export default function Track({ track }: { track: Track }) {
  const containerRef = useRef(null)

  useWavesurfer({
    container: containerRef,
    height: 100,
    waveColor: 'rgb(200, 0, 200)',
    progressColor: 'rgb(100, 0, 100)',
    url: track.url,
    barHeight: 50,
  })

  return (
    <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, width: 1 }}>
      <div ref={containerRef} />
    </Box>
  )
}
