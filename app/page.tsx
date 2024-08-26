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
        backgroundImage: 'url(/mixtape-bg.webp)',
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
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h2" component="h1" gutterBottom>
              Welcome to Mixtape.ai
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
              Your Ultimate Karaoke and Practice Companion
            </Typography>
            <Typography variant="body1" paragraph>
              Unleash your inner star with Mixtape.ai, the perfect platform for
              karaoke lovers and aspiring musicians. Whether you're practicing
              for a performance or just having fun, our tool provides everything
              you need to sing and play your heart out.
            </Typography>
            <Button variant="contained" color="secondary" href="/songs">
              Upload you first song
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                padding: 3,
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" component="h3" gutterBottom>
                Key Features:
              </Typography>
              <Typography variant="body1" paragraph>
                <ul>
                  <li>
                    Karaoke Mode: Sing along to your favorite tracks with
                    on-screen lyrics and vocal removal.
                  </li>
                  <li>
                    Instrument Isolation: Isolate and practice drums, guitar,
                    bass, and other instruments from the original song.
                  </li>
                  <li>
                    Practice Tools: Record your sessions, get feedback, and
                    track your progress over time.
                  </li>
                  <li>
                    Custom Playlists: Create and manage playlists for your
                    practice sessions and karaoke parties.
                  </li>
                  <li>
                    User-Friendly Interface: Intuitive design makes it easy to
                    find and sing or play your favorite songs.
                  </li>
                  <li>
                    Original Tracks: Use the original songs instead of generic
                    MIDI files for a more authentic experience.
                  </li>
                  <li>
                    Secure Cloud Storage: Save your recordings and access them
                    from anywhere.
                  </li>
                </ul>
              </Typography>
              <Typography variant="body1" paragraph>
                Start your musical journey today and take your performances to
                the next level.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
