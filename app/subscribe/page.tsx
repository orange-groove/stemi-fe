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
  Box,
  Chip,
  Divider,
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
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" align="center" gutterBottom>
        Choose Your Plan
      </Typography>
      <Typography
        variant="h6"
        align="center"
        color="text.secondary"
        sx={{ mb: 4 }}
      >
        Start with our free tier or upgrade for unlimited access
      </Typography>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mt: 4 }}>
        {/* Free Tier */}
        <Card sx={{ flex: 1, position: 'relative' }}>
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <Chip label="FREE" color="default" sx={{ mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Free
            </Typography>
            <Typography variant="h2" color="primary" sx={{ mb: 1 }}>
              $0
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              per month
            </Typography>

            <Box sx={{ textAlign: 'left', mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                ✓ 3 song separations per month
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                ✓ All stem types (vocals, drums, bass, piano)
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                ✓ High-quality audio output
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                ✓ Download individual stems
              </Typography>
            </Box>

            <Button
              variant="outlined"
              size="large"
              fullWidth
              onClick={() => (window.location.href = '/stems')}
            >
              Start Free
            </Button>
          </CardContent>
        </Card>

        {/* Premium Tier */}
        <Card
          sx={{
            flex: 1,
            position: 'relative',
            border: '2px solid',
            borderColor: 'primary.main',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: -12,
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            <Chip label="POPULAR" color="primary" />
          </Box>
          <CardContent sx={{ textAlign: 'center', p: 3, pt: 4 }}>
            <Typography variant="h4" gutterBottom>
              Premium
            </Typography>
            <Typography variant="h2" color="primary" sx={{ mb: 1 }}>
              $5
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              per month
            </Typography>

            <Box sx={{ textAlign: 'left', mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                ✓ 100 song separations per month
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                ✓ All stem types (vocals, drums, bass, piano)
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                ✓ High-quality audio output
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                ✓ Download individual stems
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                ✓ Priority processing
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                ✓ Cancel anytime
              </Typography>
            </Box>

            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}

            <Button
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              onClick={startCheckout}
            >
              {loading ? 'Redirecting…' : 'Upgrade to Premium'}
            </Button>
          </CardContent>
        </Card>
      </Stack>

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="body2" color="text.secondary">
          Both plans include access to all features. Upgrade anytime to get more
          separations.
        </Typography>
      </Box>
    </Container>
  )
}
