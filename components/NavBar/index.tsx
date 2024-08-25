'use client'

import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import supabase from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Header from '../Header'
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
          width: [0, 150, 200],
          height: 1,
          borderRight: '1px solid',
          borderColor: 'grey.300',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'space-between',
        }}
      >
        <Box sx={{ height: 1 }}>
          <Header />
          <List
            sx={{
              width: '100%',
              bgcolor: 'background.paper',
            }}
            aria-labelledby="list-navigation"
          >
            <ListItemButton href="/">
              <HomeIcon />
              <ListItemText primary="Home" />
            </ListItemButton>

            <ListItemButton href="/songs">
              <LibraryMusicIcon />
              <ListItemText primary="Songs" />
            </ListItemButton>
            <ListItemButton onClick={handleSignOut}>
              <LogoutIcon />
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <DarkModeToggle />
        </Box>
      </Box>
    )
  )
}
