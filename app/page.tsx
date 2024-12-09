'use client'

import MultitrackPlayer from '@/components/MultitrackPlayerV2'
import useGetSampleSong from '@/hooks/useGetSampleSong'
import { Download, Memory, UploadFile } from '@mui/icons-material'
import { Box, Typography, Container, List, ListItem } from '@mui/material'

const steps = [
  'Upload a Song',
  'Analyze and Process Stems',
  'Preview and Download Stems',
]

// Custom Step Icon Component
function StepIcon({ icon }: { icon: number }) {
  const icons: { [index: string]: React.ReactElement } = {
    1: <UploadFile sx={{ fontSize: 60 }} />,
    2: <Memory sx={{ fontSize: 60 }} />,
    3: <Download sx={{ fontSize: 60 }} />,
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      {icons[String(icon)]}
    </Box>
  )
}

export default function Home() {
  const { data: previewSong } = useGetSampleSong()

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          backgroundImage: 'url(/home-bg.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
        }}
      >
        {/* Semi-transparent overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1,
          }}
        />
        {/* Content (Title and Mock Image) */}
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          <Typography variant="h1" sx={{ mb: 4, fontWeight: 300 }}>
            Stemjam.ai
          </Typography>

          <Typography variant="h3" sx={{ mb: 4, fontWeight: 300 }}>
            Online Stem Separation Tool
          </Typography>
          <Box
            component="img"
            src="/device-mock.png"
            alt="Device Mock"
            sx={{
              maxWidth: '80%',
              height: 'auto',
              mx: 'auto',
            }}
          />
        </Box>
      </Box>

      {/* Steps Section */}
      <Box
        component="section"
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <Typography variant="h3">Separate stems in 3 easy steps:</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
          {steps.map((label, index) => (
            <Box
              key={label}
              sx={{
                height: '200px',
                width: '200px',
                borderRadius: '50%',
                border: '1px solid black',
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <StepIcon icon={index + 1} />
                <Typography sx={{ fontSize: 18, mt: 1 }}>{label}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Multitrack Player Section */}
      <Box
        component="section"
        sx={{
          mt: 8,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <Typography variant="h3">Multitrack Stem Preview</Typography>
        <Typography variant="h4">Try it out</Typography>
        <Box sx={{ width: '100%' }}>
          {previewSong && (
            <MultitrackPlayer
              songId={previewSong.id}
              tracks={previewSong?.tracks}
            />
          )}
        </Box>
      </Box>

      {/* Features Section */}
      <Box
        component="section"
        sx={{
          mt: 8,
          py: 8,
          background:
            'linear-gradient(0deg, rgba(176,0,124,1) 0%, rgba(0,0,0,1) 100%)',
          color: 'white',
        }}
      >
        <Typography variant="h3" sx={{ textAlign: 'center', mb: 2 }}>
          Features
        </Typography>
        <Container>
          <List sx={{ fontSize: '20px', textAlign: 'center' }}>
            <ListItem>
              Upload any song to separate it into isolated stem tracks.
            </ListItem>
            <ListItem>Preview your stems in our multitrack player.</ListItem>
            <ListItem>Slow down or speed up your playback rate.</ListItem>
            <ListItem>
              Adjust track volumes as well as master volume of your mix.
            </ListItem>
            <ListItem>
              Download “mixdown” of unmuted/soloed tracks as .mp3 or .wav file.
            </ListItem>
            <ListItem>
              Download selected stems and use them for karaoke, practice or
              import them into your favorite DAW.
            </ListItem>
            <ListItem>
              Pro users get additional storage and ability to create playlists.
            </ListItem>
            <ListItem>
              Playlists allow for quick playback of your songs using the
              settings of your song project. Volume, mutes, and playback rate
              are all preserved.
            </ListItem>
          </List>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Box
        id="pricing"
        component="section"
        sx={{
          backgroundColor: 'white',
          color: 'black',
          py: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <Typography variant="h3">Pricing</Typography>
        <Container
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 4,
            mt: 4,
          }}
        >
          <Box
            sx={{
              border: '1px solid black',
              borderRadius: '10px',
              p: 4,
              width: '300px',
              textAlign: 'center',
            }}
          >
            <Typography variant="h4">Free</Typography>
            <Typography variant="h5">Price: $0</Typography>
            <Typography>1 Song Upload</Typography>
            <Typography>1 Song Project</Typography>
            <Typography>1 Song Download</Typography>
            <Typography>1 Playlist</Typography>
          </Box>
          <Box
            sx={{
              border: '1px solid black',
              borderRadius: '10px',
              p: 4,
              width: '300px',
              textAlign: 'center',
            }}
          >
            <Typography variant="h4" color="secondary.main">
              Pro
            </Typography>
            <Typography variant="h5">Price: $5/month</Typography>
            <Typography>Unlimited Song Uploads</Typography>
            <Typography>Unlimited Song Projects</Typography>
            <Typography>Unlimited Song Downloads</Typography>
            <Typography>Unlimited Playlists</Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
