'use client'

import SessionSongProcessor from '@/components/SessionSongProcessor'
import { Box } from '@mui/material'

export default function StemsPage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        p: 4,
      }}
    >
      <SessionSongProcessor />
    </Box>
  )
}
