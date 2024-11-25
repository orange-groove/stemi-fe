'use client'

import {
  Box,
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/navigation'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { SyntheticEvent, useState } from 'react'
import MenuIcon from '@mui/icons-material/Menu'
import useDeletePlaylist from '@/hooks/useDeletePlaylist'
import supabase from '@/lib/supabase'
import { Playlist } from '@/api/client'
import EditableText from '../EditableText'
import useUpdatePlaylist from '@/hooks/useUpdatePlaylist'
import { useSetAtom } from 'jotai'
import { playlistDrawerAtom } from '@/state/drawer'

export default function PlaylistItem({ playlist }: { playlist: Playlist }) {
  const router = useRouter()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const isMenuOpen = Boolean(anchorEl)

  const setIsPlaylistDrawerOpen = useSetAtom(playlistDrawerAtom)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setAnchorEl(null)
  }

  const { mutate: deletePlaylist, isPending } = useDeletePlaylist()
  const { mutate: updatePlaylist } = useUpdatePlaylist()

  const handleDelete = async (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    const user = await supabase.auth.getUser()
    handleMenuClose(e)
    deletePlaylist({
      playlistId: playlist.id as number,
      userId: user?.data?.user?.id as string,
    })
  }

  const handleClick = (e: SyntheticEvent) => {
    setIsPlaylistDrawerOpen(false)
    router.push(`/playlists/${playlist.id}`)
  }

  const handlePlaylistUpdate = (title: string) => {
    updatePlaylist({ playlistId: playlist.id as number, title })
  }

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 2,
        width: 1,
        p: [1, 2],
        m: 1,
        display: 'flex',
        justifyContent: 'space-between',
        border: '1px solid transparent',
        ':hover': {
          cursor: 'pointer',
          border: '1px solid',
          borderColor: 'secondary.main',
        },
        workBreak: 'break-word',
      }}
      onClick={handleClick}
    >
      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        sx={{
          '.MuiMenu-list': {
            p: 0,
          },
        }}
      >
        <MenuList sx={{ bgcolor: 'background.default' }}>
          <MenuItem
            onClick={handleDelete}
            disabled={isPending}
            sx={{ color: 'error.main' }}
          >
            <DeleteForeverIcon />
            <ListItemText>{isPending ? 'Deleting...' : 'Delete'}</ListItemText>
          </MenuItem>
        </MenuList>
      </Menu>
      <Box>
        <EditableText
          value={playlist.title as string}
          onComplete={handlePlaylistUpdate}
          sx={{ fontSize: 20 }}
        />
        <Typography>
          {playlist?.songs?.length === 0 ? 'No' : playlist?.songs?.length} Song
          {((playlist?.songs?.length as number) > 1 ||
            playlist?.songs?.length === 0) &&
            's'}
        </Typography>
      </Box>
      <IconButton
        onClick={handleMenuOpen}
        disabled={isPending}
        sx={{ width: 50, height: 50 }}
      >
        <MenuIcon
          sx={{
            color: 'text.primary',
            fontSize: 40,
            ':hover': {
              cursor: 'pointer',
              color: 'secondary.main',
            },
          }}
        />
      </IconButton>
    </Box>
  )
}
