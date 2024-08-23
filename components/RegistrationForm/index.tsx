'use client'

import React, { useState } from 'react'
import supabase from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Box, Button, TextField, Typography } from '@mui/material'

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      // options: {
      //   emailRedirectTo: 'https://example.com/welcome',
      // },
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Typography sx={{ textAlign: 'center', mb: 2 }}>
        Register for a new account
      </Typography>
      <TextField
        label="Email"
        id="email"
        sx={{ mb: 1, width: 1 }}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        id="password"
        sx={{ mb: 1, width: 1 }}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Button variant="contained" type="submit">
          Sign Up
        </Button>
      </Box>
    </form>
  )
}

export default RegisterForm
