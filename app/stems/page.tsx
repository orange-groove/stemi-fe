'use client'

import SessionSongProcessor from '@/components/SessionSongProcessor'
import PaymentGuard from '@/components/PaymentGuard'
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
      <PaymentGuard>
        <Suspense fallback={<div>Loading...</div>}>
          <SessionSongProcessor />
        </Suspense>
      </PaymentGuard>
    </Box>
  )
}
