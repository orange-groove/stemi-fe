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
} from '@mui/material'
import { blue } from '@mui/material/colors'
import { useAtomValue } from 'jotai'
import { userAtom } from '@/state/user'
import config from '@/config'
import { client as apiClient } from '@/api/client/services.gen'

const ProfilePage = () => {
  const user = useAtomValue(userAtom)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
          </Stack>
        </Paper>
      </Box>
    )
  )
}

export default ProfilePage
