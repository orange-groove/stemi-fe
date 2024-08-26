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
      <Typography sx={{ mb: 8, fontSize: [50, 100, 200] }}>
        stemjams.ai
      </Typography>
      <RegisterForm />
    </Box>
  )
}
