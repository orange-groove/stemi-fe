'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Snackbar,
} from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google'
import supabase from '@/lib/supabase'

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [resetMessage, setResetMessage] = useState('')
  const [showSnackbar, setShowSnackbar] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const user = await supabase.auth.signInWithPassword({ email, password })
    if (user.data.user) {
      router.push('/stems')
    }
  }

  useEffect(() => {
    ;(async () => {
      const user = await supabase.auth.getUser()
      if (user.data.user) {
        router.push('/stems')
      }
    })()
  }, [router])

  const handleGoogleLogin = () => {
    supabase.auth.signInWithOAuth({
      provider: 'google',
    })
  }

  const handleForgotPassword = async () => {
    if (!email) {
      setResetMessage('Please enter your email address first')
      setShowSnackbar(true)
      return
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        setResetMessage('Error sending reset email: ' + error.message)
      } else {
        setResetMessage('Password reset email sent! Check your inbox.')
      }
      setShowSnackbar(true)
    } catch (err) {
      setResetMessage('Error sending reset email')
      setShowSnackbar(true)
    }
  }

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
      <Box sx={{ textAlign: 'right', mb: 2 }}>
        <Button
          variant="text"
          size="small"
          onClick={handleForgotPassword}
          sx={{ color: 'primary.main', textTransform: 'none' }}
        >
          Forgot Password?
        </Button>
      </Box>
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
            backgroundColor: 'background.paper',
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
          sx={{ color: 'primary.main' }}
        >
          Register here &rarr;
        </Button>
      </Box>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowSnackbar(false)}
          severity={resetMessage.includes('Error') ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {resetMessage}
        </Alert>
      </Snackbar>
    </form>
  )
}

export default LoginForm
