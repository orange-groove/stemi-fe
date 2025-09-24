'use client'

import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material'
import supabase from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import DarkModeToggle from '../DarkModeToggle'
import { Logout } from '@mui/icons-material'
import { useState } from 'react'
import { useAtomValue } from 'jotai'
import { userAtom } from '@/state/user'

export default function NavBar() {
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const user = useAtomValue(userAtom)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleProfileClick = () => {
    router.push('/profile')
    handleClose()
  }

  return (
    <Box
      component="nav"
      sx={{
        width: 1,
        height: 70,
        p: 2,
        display: 'flex',
        justifyContent: 'space-between',
        gap: 2,
        alignItems: 'center',
      }}
    >
      <Box onClick={() => router.push('/')} sx={{ cursor: 'pointer' }}>
        <Typography variant="h4" color="primary.main">
          stemi
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'right',
          alignItems: 'center',
          gap: [2, 6],
          bgcolor: 'background.default',
          flexGrow: 1,
          height: 1,
          cursor: 'pointer',
        }}
        aria-labelledby="list-navigation"
      >
        {user && (
          <>
            <Typography onClick={() => router.push('/stems')}>Stems</Typography>
          </>
        )}
        <Typography onClick={() => router.push('/#pricing')}>
          Pricing
        </Typography>
        <Typography onClick={() => router.push('/contact')}>Contact</Typography>
        {!user && (
          <Typography onClick={() => router.push('/login')}>Login</Typography>
        )}
        <Tooltip title="Dark Mode">
          <Box>
            <DarkModeToggle />
          </Box>
        </Tooltip>
        {user && (
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleClick}
              size="small"
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <Avatar
                alt={user?.user_metadata.name}
                src={user?.user_metadata.avatar_url}
                sx={{ width: 32, height: 32 }}
              />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      {user && (
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
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleProfileClick}>
            <ListItemIcon>
              <Avatar
                alt={user?.user_metadata.name}
                src={user?.user_metadata.avatar_url}
                sx={{ width: 24, height: 24 }}
              />
            </ListItemIcon>
            Profile
          </MenuItem>

          <Divider sx={{ my: 0.5 }} />
          <MenuItem onClick={handleSignOut}>
            <ListItemIcon>
              <Logout sx={{ fontSize: 24 }} />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      )}
    </Box>
  )
}
