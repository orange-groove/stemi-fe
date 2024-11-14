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
import { useAtomValue, useSetAtom } from 'jotai'
import { userAtom } from '@/state/user'
import { userSongsAtom } from '@/state/song'
import { Song as SongType } from '@/types'
import { SyntheticEvent, useState } from 'react'
import useSongFromGenius from '@/hooks/useSongFromGenius'
import MenuIcon from '@mui/icons-material/Menu'

export default function Song({ song }: { song: SongType }) {
  const router = useRouter()
  const user = useAtomValue(userAtom)
  const setUserSongs = useSetAtom(userSongsAtom)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const isMenuOpen = Boolean(anchorEl)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    console.log('Menu open triggered') // Added logging
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const { data: geniusSongData, isFetching } = useSongFromGenius(
    song?.name,
    song?.artist,
  )

  const { mutate: deleteSong, isPending, error } = useDeleteSong()

  const handleDelete = (e: SyntheticEvent) => {
    e.stopPropagation()
    handleMenuClose()
    user?.id &&
      song?.tracks &&
      deleteSong(
        {
          songId: song.id,
          userId: user.id,
          playlistId: song.playlistId,
          tracks: song.tracks,
        },
        {
          onSuccess: () => {
            console.log('Song and associated files deleted successfully.')
          },
          onError: (err) => {
            console.error('Error deleting song:', err)
          },
        },
      )
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
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <IconButton
          onClick={handleMenuOpen}
          disabled={isPending}
          sx={{ position: 'absolute', top: 6, right: 6 }}
        >
          <MenuIcon sx={{ color: 'secondary.main', fontSize: 60 }} />
        </IconButton>
        <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose}>
          <MenuItem onClick={handleDelete} disabled={isPending}>
            {isPending ? (
              'Deleting...'
            ) : (
              <DeleteForeverIcon
                sx={{ color: 'secondary.main', fontSize: 60 }}
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
                  backgroundImage: `url(${geniusSongData?.result?.header_image_url})`,
                  width: '200px',
                  height: '200px',
                  backgroundSize: 'contain',
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', p: 2 }}>
              <Typography variant="h4">{song?.artist}</Typography>
              <Typography variant="h5">{song?.name}</Typography>
              <Typography variant="body1">
                Created At:{' '}
                {song.createdAt
                  ? new Date(song.createdAt).toLocaleString('en-US', {
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
