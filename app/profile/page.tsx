'use client'

import React, { useState } from 'react'
import {
  Avatar,
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import { blue } from '@mui/material/colors'
import { useAtomValue } from 'jotai'
import { userAtom } from '@/state/user'
import config from '@/config'
import { client as apiClient } from '@/api/client/services.gen'
import { useCancelSubscription } from '@/hooks/useCancelSubscription'
import { useUsage } from '@/hooks/useUsage'
import { useRouter } from 'next/navigation'

const ProfilePage = () => {
  const user = useAtomValue(userAtom)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const { usage } = useUsage()
  const {
    cancelSubscription,
    loading: cancelLoading,
    error: cancelError,
    setError: setCancelError,
  } = useCancelSubscription()

  async function openBillingPortal() {
    if (!user) return
    setLoading(true)
    setError(null)
    try {
      const res = await apiClient.instance.post(
        config.baseApiUrl + '/billing/portal',
        {
          return_url: `${window.location.origin}/profile`,
        },
      )

      if (!res.data) {
        const j = await res.data
        throw new Error(res.data?.error || 'Failed to open billing portal')
      }
      const { url } = await res.data
      window.location.href = url
    } catch (e: any) {
      setError(e?.message ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    const result = await cancelSubscription()
    if (result.success) {
      setCancelDialogOpen(false)
      // Optionally redirect to home or show success message
      window.location.href = '/'
    }
  }

  return (
    user && (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: 'background.paper',
          p: 3,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 4,
            maxWidth: 400,
            width: '100%',
            borderRadius: 2,
            bgcolor: 'background.paper',
          }}
        >
          <Avatar
            src={user.user_metadata.avatar_url}
            sx={{
              width: 80,
              height: 80,
              mb: 2,
              bgcolor: blue[500],
            }}
          />

          <Typography variant="h5" component="h1" gutterBottom>
            {user.user_metadata.full_name}
          </Typography>

          <Typography variant="h6" component="p" gutterBottom>
            {user.user_metadata.email}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
              {error}
            </Alert>
          )}

          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button
              variant="contained"
              disabled={loading}
              onClick={openBillingPortal}
            >
              {loading ? 'Opening…' : 'Manage billing'}
            </Button>

            {usage?.is_premium ? (
              <Button
                variant="outlined"
                color="error"
                onClick={() => setCancelDialogOpen(true)}
              >
                Cancel membership
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={() => router.push('/subscribe')}
              >
                Upgrade to Premium
              </Button>
            )}
          </Stack>
        </Paper>

        {/* Cancel Subscription Confirmation Dialog */}
        <Dialog
          open={cancelDialogOpen}
          onClose={() => setCancelDialogOpen(false)}
        >
          <DialogTitle>Cancel Membership</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to cancel your membership? You&apos;ll lose
              access to premium features and will be limited to 3 songs per
              month.
            </Typography>
            {cancelError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {cancelError}
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCancelDialogOpen(false)}>
              Keep membership
            </Button>
            <Button
              onClick={handleCancelSubscription}
              color="error"
              variant="contained"
              disabled={cancelLoading}
            >
              {cancelLoading ? 'Cancelling...' : 'Yes, cancel membership'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    )
  )
}

export default ProfilePage
