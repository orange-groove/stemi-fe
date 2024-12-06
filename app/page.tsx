import { Box, Typography, Button, Grid, Container } from '@mui/material'

export default function Home() {
  return (
    <Box
      component="main"
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'background.paper',
        backgroundImage: 'url(/home-bg.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        padding: 4,
        '::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
          zIndex: 1,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        Landing page
      </Container>
    </Box>
  )
}
