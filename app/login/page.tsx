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
        width: 1,
        height: '100vh',
      }}
    >
      <Typography sx={{ mb: 8, fontSize: [50, 100, 200] }}>
        stemjams.ai
      </Typography>
      <LoginForm />
    </Box>
  )
}
