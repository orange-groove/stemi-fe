'use client'

import {
  Box,
  IconButton,
  List,
  ListItem,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/navigation'
import useDeleteSong from '@/hooks/useDeleteSong'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { useAtomValue } from 'jotai'
import { userAtom } from '@/state/user'
import { Song as SongType } from '@/types'
import { SyntheticEvent, useState } from 'react'
import useSongFromGenius from '@/hooks/useSongFromGenius'
import MenuIcon from '@mui/icons-material/Menu'

export default function Song({ song }: { song: SongType }) {
  const router = useRouter()
  const user = useAtomValue(userAtom)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const isMenuOpen = Boolean(anchorEl)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    console.log('Menu open triggered') // Added logging
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    setAnchorEl(null)
  }

  const { mutate: deleteSong, isPending, error } = useDeleteSong()

  const handleDelete = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    handleMenuClose(e)
    user?.id &&
      song?.tracks &&
      deleteSong({
        songId: song.id,
        userId: user.id,
        playlistId: song.playlist_id,
        tracks: song.tracks,
      })
  }

  const handleClick = (e: SyntheticEvent) => {
    e.stopPropagation()
    router.push(`/songs/${song.id}`)
  }

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 2,
        width: 1,
        p: [1, 2],
        border: '3px dashed',
        borderColor: 'secondary.main',
        m: 2,
        ':hover': {
          cursor: 'pointer',
          borderColor: 'primary.main',
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <IconButton
          onClick={handleMenuOpen}
          disabled={isPending}
          sx={{ position: 'absolute', top: 6, right: 6, zIndex: 1 }}
        >
          <MenuIcon sx={{ color: 'secondary.main', fontSize: 40 }} />
        </IconButton>
        <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose}>
          <MenuItem onClick={handleDelete} disabled={isPending}>
            {isPending ? (
              'Deleting...'
            ) : (
              <DeleteForeverIcon
                sx={{ color: 'secondary.main', fontSize: 40 }}
              />
            )}
          </MenuItem>
        </Menu>
      </Box>
      <List>
        <ListItem onClick={handleClick}>
          <Box sx={{ display: 'flex', gap: 2, p: 2 }}>
            <Box>
              <Paper
                sx={{
                  backgroundImage: `url(${song?.image_url})`,
                  width: '200px',
                  height: '200px',
                  backgroundSize: 'contain',
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', p: 2 }}>
              <Typography variant="h4">{song?.title}</Typography>
              <Typography variant="h5">{song?.artist}</Typography>
              <Typography variant="body1">
                Created At:{' '}
                {song.created_at
                  ? new Date(song.created_at).toLocaleString('en-US', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true,
                    })
                  : 'N/A'}
              </Typography>
            </Box>
          </Box>
        </ListItem>
      </List>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </Box>
  )
}
