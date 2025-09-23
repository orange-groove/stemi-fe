import { Metadata } from 'next'
import SessionSongProcessor from '@/components/SessionSongProcessor'
import PaymentGuard from '@/components/PaymentGuard'
import { Box } from '@mui/material'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Stem Separation Studio - Stemi',
  description:
    'Upload and separate your songs into individual stems. Professional AI-powered stem separation with real-time preview and download capabilities.',
  robots: {
    index: false,
    follow: false,
  },
}

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
