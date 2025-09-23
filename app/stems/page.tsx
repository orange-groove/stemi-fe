'use client'

import SessionSongProcessor from '@/components/SessionSongProcessor'
import PaymentGuard from '@/components/PaymentGuard'
import { Box } from '@mui/material'
import { Suspense } from 'react'
import SEO from '@/components/SEO'

export default function StemsPage() {
  return (
    <>
      <SEO
        title="Stem Separation Studio - Stemi"
        description="Upload and separate your songs into individual stems. Professional AI-powered stem separation with real-time preview and download capabilities."
        noIndex={true}
      />
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
    </>
  )
}
