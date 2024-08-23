'use client'

import { Box, Button } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import supabase from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function NavBar() {
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <Box
      component="nav"
      sx={{
        width: [0, 150, 200],
        height: '100vh',
        p: 6,
        border: '1px solid',
        borderColor: 'gray.500',
      }}
    >
      <Box
        component="ul"
        sx={{
          listStyle: 'none',
          display: 'flex',
          flexDirection: 'column',
          li: { height: '50px' },
        }}
      >
        <Box component="li" sx={{ mb: 6 }}>
          <a href="/">
            <HomeIcon sx={{ fontSize: 40 }} />
          </a>
        </Box>
        <Box component="li" sx={{ height: '50px' }}>
          <a href="/songs">Songs</a>
        </Box>

        <Box component="li" sx={{ height: '50px' }}>
          <Button onClick={handleSignOut}>Log Out</Button>
        </Box>
      </Box>
    </Box>
  )
}
