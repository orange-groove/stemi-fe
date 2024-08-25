import React, { useState } from 'react'
import { TextField, Button, Box, Typography } from '@mui/material'
import RegisterForm from '@/components/RegistrationForm'

export default function RegisterPage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',

        height: '100vh',
      }}
    >
      <Typography variant="h1" sx={{ mb: 8, fontSize: 200 }}>
        mixtape.ai
      </Typography>
      <RegisterForm />
    </Box>
  )
}
