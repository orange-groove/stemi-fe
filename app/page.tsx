import { Box, Container, Typography } from '@mui/material'

export default function Home() {
  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <Typography>home page</Typography>
    </Box>
  )
}
