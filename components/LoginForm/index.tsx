'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLogin } from '@/hooks/useAuth' // Adjust the import path as necessary
import { Box, Button, TextField, Typography } from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google'
import supabase from '@/lib/supabase'

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const loginMutation = useLogin()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const user = await supabase.auth.signInWithPassword({ email, password })
    if (user.data.user) {
      router.push('/')
    }
  }

  useEffect(() => {
    ;(async () => {
      const user = await supabase.auth.getUser()
      if (user.data.user) {
        router.push('/')
      }
    })()
  }, [loginMutation.isSuccess, router])

  const handleGoogleLogin = () => {}

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Email"
        id="email"
        sx={{ mb: 1, width: 1 }}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        id="password"
        type="password"
        sx={{ mb: 1, width: 1 }}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Button variant="contained" type="submit">
          Login
        </Button>
      </Box>
      <Box sx={{ position: 'relative', my: 6 }}>
        <Box
          component="hr"
          sx={{
            width: '100%',
            borderColor: 'grey.500',
          }}
        />
        <Typography
          sx={{
            textAlign: 'center',
            position: 'absolute',
            backgroundColor: '#fff',
            transform: 'translate(-50%, -50%)',
            left: '50%',
            width: '50px',
            marginTop: '-10px',
          }}
        >
          Or
        </Typography>
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        <Button
          variant="outlined"
          onClick={handleGoogleLogin}
          sx={{ color: '#ba000d' }}
        >
          <GoogleIcon />
          &nbsp; Login with Google
        </Button>
      </Box>

      <Box
        sx={{
          textAlign: 'center',
          mt: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="body2">Don&apos;t have an account?</Typography>
        <Button
          variant="text"
          onClick={() => router.push('/register')}
          sx={{ color: '#ba000d' }}
        >
          Register here &rarr;
        </Button>
      </Box>
    </form>
  )
}

export default LoginForm
