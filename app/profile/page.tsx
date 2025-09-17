'use client'

import React from 'react'
import { Avatar, Box, Typography, Paper } from '@mui/material'
import { blue } from '@mui/material/colors'
import { useAtomValue } from 'jotai'
import { userAtom } from '@/state/user'

const ProfilePage = () => {
  const user = useAtomValue(userAtom)

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

          <Typography variant="h5" component="h1" gutterBottom>
            {user.user_metadata.email}
          </Typography>
        </Paper>
      </Box>
    )
  )
}

export default ProfilePage
