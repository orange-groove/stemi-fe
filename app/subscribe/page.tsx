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
import { client as apiClient } from '@/api/client/services.gen'
import '@/lib/axios'

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
      const res = await apiClient.instance.post(
        `${config.baseApiUrl}/billing/checkout`,
        {
          success_url: `${window.location.origin}/stems?checkout=success`,
          cancel_url: `${window.location.origin}/stems?checkout=cancel`,
        },
      )
      const { url } = res.data
      // Redirect in the same window, not a new tab
      window.location.assign(url)
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
      const res = await apiClient.instance.post(
        `${config.baseApiUrl}/billing/portal`,
        {
          return_url: `${window.location.origin}/profile`,
        },
      )
      const { url } = res.data
      window.location.assign(url)
    } catch (e: any) {
      setError(e?.message ?? 'Something went wrong')
    } finally {
      setPortalLoading(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Card>
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Subscribe
          </Typography>
          <Typography variant="body1" gutterBottom>
            Unlock full access for <strong>$5/month</strong>. Cancel anytime.
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
              fullWidth
              disabled={loading}
              onClick={startCheckout}
            >
              {loading ? 'Redirecting…' : 'Subscribe'}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  )
}
