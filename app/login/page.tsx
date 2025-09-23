'use client'

import { Box, Typography } from '@mui/material'
import LoginForm from '@/components/LoginForm'
import SEO from '@/components/SEO'

export default function LoginPage() {
  return (
    <>
      <SEO
        title="Login - Stemi"
        description="Sign in to your Stemi account to access professional stem separation tools."
        noIndex={true}
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: 1,
          height: '100vh',
        }}
      >
        <Typography sx={{ mb: 8, fontSize: [50, 100, 200] }}>stemi</Typography>
        <LoginForm />
      </Box>
    </>
  )
}
