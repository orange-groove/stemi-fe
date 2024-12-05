import React, { useState } from 'react'
import {
  Box,
  Button,
  FormGroup,
  FormLabel,
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
import { useAtomValue, useSetAtom } from 'jotai'
import { userAtom } from '@/state/user'
import MenuIcon from '@mui/icons-material/Menu'
import { Song as SongType } from '@/api/client'
import useUpdateSong from '@/hooks/useUpdateSong'
import EditableText from '../EditableText'
import { songAtom } from '@/state/song'
import { songDrawerAtom } from '@/state/drawer'

export default function Song({ song }: { song: SongType }) {
  const router = useRouter()
  const user = useAtomValue(userAtom)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const setSongMenuOpen = useSetAtom(songDrawerAtom)

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
    setSongMenuOpen(false)
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
        p: 1,
        ':hover': {
          cursor: 'pointer',
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
          <Box sx={{ display: 'flex', gap: 2 }}>
            {song?.image_url && (
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
            )}
            <Box sx={{ display: 'flex', flexDirection: 'column', p: 1 }}>
              <FormGroup>
                <EditableText
                  value={song?.title || ''}
                  placeholder="Song Title"
                  onComplete={handleTitleUpdate}
                  disabled={isUpdateSongPending}
                  sx={{
                    fontSize: 18,
                  }}
                />
              </FormGroup>
              <FormGroup>
                <EditableText
                  value={song?.artist || ''}
                  placeholder="Song Artist"
                  onComplete={handleArtistUpdate}
                  disabled={isUpdateSongPending}
                  sx={{
                    fontSize: 'h5.fontSize',
                  }}
                />
              </FormGroup>

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
