'use client'

import { useState, useEffect } from 'react'
import { useAtomValue } from 'jotai'
import { userAtom } from '@/state/user'
import {
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
} from '@mui/material'
import config from '@/config'

export default function SubscribePage() {
  const user = useAtomValue(userAtom)
  const [loading, setLoading] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setError(null)
  }, [user?.id])

  async function startCheckout() {
    if (!user) {
      setError('Please sign in first')
      return
    }
    setLoading(true)
    setError(null)
    try {
      console.log(
        'Calling checkout at:',
        `${config.baseApiUrl}/billing/checkout`,
      )
      const res = await fetch(`${config.baseApiUrl}/billing/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          success_url: `${window.location.origin}/stems?checkout=success`,
          cancel_url: `${window.location.origin}/stems?checkout=cancel`,
        }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j?.error || 'Failed to start checkout')
      }
      const { url } = await res.json()
      window.location.href = url
    } catch (e: any) {
      setError(e?.message ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function openBillingPortal() {
    if (!user) {
      setError('Please sign in first')
      return
    }
    setPortalLoading(true)
    setError(null)
    try {
      const res = await fetch(`${config.baseApiUrl}/billing/portal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          return_url: `${window.location.origin}/profile`,
        }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j?.error || 'Failed to open billing portal')
      }
      const { url } = await res.json()
      window.location.href = url
    } catch (e: any) {
      setError(e?.message ?? 'Something went wrong')
    } finally {
      setPortalLoading(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Subscribe
          </Typography>
          <Typography variant="body1" gutterBottom>
            Unlock full access for $5/month. Cancel anytime.
          </Typography>
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button
              variant="contained"
              size="large"
              disabled={loading}
              onClick={startCheckout}
            >
              {loading ? 'Redirecting…' : 'Subscribe for $5/mo'}
            </Button>
            <Button
              variant="text"
              size="large"
              disabled={portalLoading}
              onClick={openBillingPortal}
            >
              {portalLoading ? 'Opening…' : 'Manage billing'}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  )
}
