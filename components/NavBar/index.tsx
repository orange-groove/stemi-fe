'use client'

import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Paper,
  Tooltip,
  Typography,
} from '@mui/material'
import supabase from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic'
import LogoutIcon from '@mui/icons-material/Logout'
import { useAtomValue } from 'jotai'
import { userAtom } from '@/state/user'
import DarkModeToggle from '../DarkModeToggle'
import { Logout, PersonAdd, Settings } from '@mui/icons-material'
import { useState } from 'react'

export default function NavBar() {
  const router = useRouter()
  const user = useAtomValue(userAtom)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    !!user?.id && (
      <Box
        component="nav"
        sx={{
          width: 1,
          height: 70,
          p: 2,
          display: 'flex',
          alignItems: 'space-between',
        }}
      >
        <Box onClick={() => router.push('/')} sx={{ cursor: 'pointer' }}>
          <Typography variant="h4" color="secondary.main">
            stemjams
          </Typography>
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
            cursor: 'pointer',
          }}
          aria-labelledby="list-navigation"
        >
          <Tooltip title="Library">
            <Box onClick={() => router.push('/songs')}>My Library</Box>
          </Tooltip>

          <Tooltip title="Dark Mode">
            <Box>
              <DarkModeToggle />
            </Box>
          </Tooltip>
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <Avatar
                alt={user?.user_metadata.name}
                sx={{ width: 32, height: 32 }}
              />
            </IconButton>
          </Tooltip>
        </Box>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          slotProps={{
            root: {
              sx: {
                '& .MuiMenu-paper': {
                  cursor: 'pointer',
                },
              },
            },
            paper: {
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&::before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleClose}>
            <Avatar /> Profile
          </MenuItem>

          <Divider />

          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
          <MenuItem onClick={handleSignOut}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Box>
    )
  )
}
