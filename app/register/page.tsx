'use client'

import { Box, Typography } from '@mui/material'
import RegisterForm from '@/components/RegistrationForm'

export default function RegisterPage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography sx={{ mb: 8, fontSize: [50, 100, 200] }}>stemi</Typography>
      <RegisterForm />
    </Box>
  )
}
