import { Box } from '@mui/material'
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
      <LoginForm />
    </Box>
  )
}
