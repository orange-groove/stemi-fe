'use client'

import { Download, Memory, UploadFile } from '@mui/icons-material'
import { Box, Typography, Container } from '@mui/material'
import StructuredData from '@/components/StructuredData'

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
  return (
    <>
      <StructuredData />
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
            <Typography
              component="h1"
              variant="h1"
              sx={{ mb: 4, fontWeight: 300, color: 'primary.main' }}
            >
              stemi
            </Typography>

            <Typography
              component="h2"
              variant="h3"
              sx={{ mb: 4, fontWeight: 300 }}
            >
              Online Stem Separation Tool
            </Typography>
            <Typography
              component="p"
              variant="h5"
              sx={{ mb: 4, fontWeight: 300 }}
            >
              Separate any song into individual stems with AI-powered precision
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
          <Typography component="h2" variant="h3">
            How it works:
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 6,
              flexDirection: ['column', 'row'],
            }}
          >
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

        {/* Features Section */}
        <Box
          component="section"
          sx={{
            mt: 8,
            height: '500px',
            background: 'linear-gradient(0deg, #6933ff 0%, rgba(0,0,0,1) 100%)',
            color: 'white',
          }}
        >
          <Typography
            component="h2"
            variant="h3"
            sx={{ textAlign: 'center', mb: 2, mt: 2 }}
          >
            Features
          </Typography>
          <Box
            sx={{
              textAlign: 'center',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Typography fontSize="20px">
              Upload any song to separate it into isolated stem tracks (vocals,
              guitar, drums, bass, piano, other)
            </Typography>
            <Typography fontSize="20px">
              Preview your separated stems in our multitrack player
            </Typography>
            <Typography fontSize="20px">
              Adjust playback speed and volume for each stem
            </Typography>
            <Typography fontSize="20px">
              Download individual stems as MP3, WAV, or OGG files
            </Typography>
            <Typography fontSize="20px">
              Download a custom mixdown of selected stems
            </Typography>
          </Box>
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
          <Typography component="h2" variant="h3">
            Pricing
          </Typography>
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
                borderRadius: '10px',
                color: 'white',
                p: 4,
                width: '400px',
                textAlign: 'center',
                backgroundColor: 'primary.main',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h4">$5/month</Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  alignItems: 'start',
                }}
              >
                <Typography sx={{ mt: 2 }}>
                  Unlimited stem separation
                </Typography>
                <Typography>High-quality AI processing</Typography>
                <Typography>Multiple download formats</Typography>
                <Typography>Custom mixdown creation</Typography>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    </>
  )
}
