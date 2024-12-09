'use client'

import { Inter } from 'next/font/google'
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

const inter = Inter({ subsets: ['latin'] })

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
      </body>
    </html>
  )
}
