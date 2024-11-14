'use client'

import { Box, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { useAtomValue } from 'jotai'
import { userAtom } from '@/state/user'
import { Playlist as PlaylistType } from '@/types'
import { SyntheticEvent, useState } from 'react'
import MenuIcon from '@mui/icons-material/Menu'
import useDeletePlaylist from '@/hooks/useDeletePlaylist'

export default function Playlist({ playlist }: { playlist: PlaylistType }) {
  const router = useRouter()
  const user = useAtomValue(userAtom)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const isMenuOpen = Boolean(anchorEl)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setAnchorEl(null)
  }

  const { mutate: deletePlaylist, isPending } = useDeletePlaylist()

  const handleDelete = (e: SyntheticEvent) => {
    e.stopPropagation()
    handleMenuClose(e)
    user?.id &&
      deletePlaylist(
        { playlistId: playlist.id, userId: user.id },
        {
          onSuccess: () => {
            console.log('Playlist deleted successfully.')
          },
          onError: (err) => {
            console.error('Error deleting playlist:', err)
          },
        },
      )
  }

  const handleClick = (e: SyntheticEvent) => {
    router.push(`/playlists/${playlist.id}`)
  }

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 2,
        width: 1,
        height: 100,
        p: [1, 2],
        border: '3px dashed',
        borderColor: 'secondary.main',
        m: 1,
        position: 'relative',
        ':hover': {
          cursor: 'pointer',
          borderColor: 'primary.main',
        },
      }}
      onClick={handleClick}
    >
      <IconButton
        onClick={handleMenuOpen}
        disabled={isPending}
        sx={{ position: 'absolute', top: 6, right: 6, p: 0 }}
      >
        <MenuIcon sx={{ color: 'secondary.main', fontSize: 40 }} />
      </IconButton>
      <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose}>
        <MenuItem onClick={handleDelete} disabled={isPending}>
          {isPending ? (
            'Deleting...'
          ) : (
            <DeleteForeverIcon sx={{ color: 'error.dark', fontSize: 40 }} />
          )}
        </MenuItem>
      </Menu>
      <Typography variant="h5">{playlist?.name}</Typography>
      <Typography variant="h5">3 Songs</Typography>
    </Box>
  )
}
