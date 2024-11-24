import React, { useState } from 'react'
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
import MenuIcon from '@mui/icons-material/Menu'
import { Song as SongType } from '@/api/client'
import useUpdateSong from '@/hooks/useUpdateSong'
import EditableInput from '../EditableInput'

export default function Song({ song }: { song: SongType }) {
  const router = useRouter()
  const user = useAtomValue(userAtom)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const isMenuOpen = Boolean(anchorEl)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    setAnchorEl(null)
  }

  const { mutate: deleteSong, isPending, error } = useDeleteSong()
  const {
    mutate: updateSong,
    isPending: isUpdateSongPending,
    error: isUpdateSongError,
  } = useUpdateSong()

  const handleDelete = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    handleMenuClose(e)
    user?.id && deleteSong({ song })
  }

  const handleClick = (e: React.SyntheticEvent) => {
    e.stopPropagation()
    router.push(`/songs/${song.id}`)
  }

  const handleTitleUpdate = (newTitle: string) => {
    if (newTitle !== song?.title) {
      updateSong({
        song: {
          id: song.id,
          title: newTitle,
        },
      })
    }
  }

  const handleArtistUpdate = (newArtist: string) => {
    if (newArtist !== song?.artist) {
      updateSong({
        song: {
          id: song.id,
          artist: newArtist,
        },
      })
    }
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
                  width: '100px',
                  height: '100px',
                  backgroundSize: 'contain',
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', p: 2 }}>
              <EditableInput
                value={song?.title || ''}
                placeholder="Song Title"
                onComplete={handleTitleUpdate}
                disabled={isUpdateSongPending}
                sx={{
                  border: 'none',
                  borderRadius: 1,
                  px: 1,
                  fontSize: 'h5.fontSize',
                  mb: 1,
                }}
              />
              <EditableInput
                value={song?.artist || ''}
                placeholder="Song Artist"
                onComplete={handleArtistUpdate}
                disabled={isUpdateSongPending}
                sx={{
                  border: 'none',
                  borderRadius: 1,
                  px: 1,
                  fontSize: 'h5.fontSize',
                  mb: 1,
                }}
              />
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

      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
    </Box>
  )
}
