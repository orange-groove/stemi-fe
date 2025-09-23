'use client'

import SessionSongProcessor from '@/components/SessionSongProcessor'
import { Box } from '@mui/material'
import { Suspense } from 'react'

export default function StemsPage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        p: [0, 4],
      }}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <SessionSongProcessor />
      </Suspense>
    </Box>
  )
}
