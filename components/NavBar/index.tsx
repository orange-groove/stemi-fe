'use client'

import { Avatar, Box, Tooltip, Typography } from '@mui/material'
import supabase from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic'
import LogoutIcon from '@mui/icons-material/Logout'
import { useAtomValue } from 'jotai'
import { userAtom } from '@/state/user'
import DarkModeToggle from '../DarkModeToggle'

export default function NavBar() {
  const router = useRouter()
  const user = useAtomValue(userAtom)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    !!user?.id && (
      <Box
        component="nav"
        sx={{
          width: 1,
          height: 60,
          p: 2,
          display: 'flex',
          alignItems: 'space-between',
        }}
      >
        <Box onClick={() => router.push('/')} sx={{ cursor: 'pointer' }}>
          <Typography variant="h4">Mixtape</Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'right',
            alignItems: 'center',
            gap: 2,
            bgcolor: 'background.paper',
            flexGrow: 1,
            height: 1,
          }}
          aria-labelledby="list-navigation"
        >
          <Tooltip title="Library">
            <Box onClick={() => router.push('/songs')}>
              <LibraryMusicIcon />
            </Box>
          </Tooltip>
          <Tooltip title="Sign Out">
            <Box onClick={handleSignOut}>
              <LogoutIcon />
            </Box>
          </Tooltip>
          <Tooltip title="Dark Mode">
            <Box>
              <DarkModeToggle />
            </Box>
          </Tooltip>
          <Tooltip title="Profile">
            <Avatar
              alt={user?.user_metadata.name}
              src={user?.user_metadata?.image}
            />
          </Tooltip>
        </Box>
      </Box>
    )
  )
}
