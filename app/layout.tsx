import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import Providers from '@/components/Providers'
import NavBar from '@/components/NavBar'
import GlobalSnackbar from '@/components/GlobalSnackbar'
import { Box } from '@mui/material'

import './globals.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import AuthGuard from '@/components/AuthGuard'

import '@/lib/axios'
import Footer from '@/components/Footer'
import { GoogleAnalytics } from '@/components/Analytics'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Stemi - Professional Stem Separation Tool',
    template: '%s | Stemi',
  },
  description:
    'Separate any song into individual stems with AI-powered precision. Upload, preview, and download isolated tracks for vocals, drums, bass, and more.',
  keywords: [
    'stem separation',
    'AI music',
    'audio processing',
    'music production',
    'isolated tracks',
    'vocals',
    'drums',
    'bass',
    'piano',
    'guitar',
    'karaoke',
    'instrumental',
    'acapella',
    'music remix',
    'audio stem',
    'song separation',
    'track isolation',
    'music stem',
    'audio stem separation',
    'AI audio',
    'music AI',
    'stem extractor',
    'vocal isolation',
    'drum separation',
    'bass extraction',
    'music stem separation',
    'online stem separator',
    'free stem separation',
    'professional stem separation',
    'music production tool',
    'audio editing',
    'music mixing',
    'stem creator',
    'track splitter',
    'music analyzer',
  ],
  authors: [{ name: 'Stemi' }],
  creator: 'Stemi',
  publisher: 'Stemi',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.stemi.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.stemi.app',
    siteName: 'Stemi',
    title: 'Stemi - Professional Stem Separation Tool',
    description:
      'Separate any song into individual stems with AI-powered precision. Upload, preview, and download isolated tracks for vocals, drums, bass, and more.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Stemi - Professional Stem Separation Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stemi - Professional Stem Separation Tool',
    description:
      'Separate any song into individual stems with AI-powered precision. Upload, preview, and download isolated tracks for vocals, drums, bass, and more.',
    images: ['/og-image.png'],
    creator: '@stemi',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // verification: {
  //   google:
  //     process.env.GOOGLE_SITE_VERIFICATION || 'your-google-verification-code',
  // },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://accounts.google.com/gsi/client" async></script>
      </head>
      <body className={inter.className} style={{ margin: 0, padding: 0 }}>
        <AuthGuard>
          <Providers>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh', // Ensures full viewport height
                width: '100%',
                backgroundColor: 'background.default',
              }}
            >
              {/* Navbar at the top */}
              <NavBar />

              {/* Main content area */}
              <Box
                component="main"
                sx={{
                  flex: 1, // Takes up remaining space
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {children}
              </Box>

              {/* Footer at the bottom */}
              <Footer />
            </Box>
            <GlobalSnackbar />
          </Providers>
        </AuthGuard>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics GA_TRACKING_ID={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  )
}
