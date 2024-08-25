import { Box, Typography } from '@mui/material'
import LoginForm from '@/components/LoginForm'

export default function LoginPage() {
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
        supayoke
      </Typography>
      <LoginForm />
    </Box>
  )
}
