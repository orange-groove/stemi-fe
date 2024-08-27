'use client'

import {
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/navigation'
import useDeleteSong from '@/hooks/useDeleteSong'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { useAtomValue, useSetAtom } from 'jotai'
import { userAtom } from '@/state/user'
import { userSongsAtom } from '@/state/song'
import { Song as SongType } from '@/types'
import { SyntheticEvent } from 'react'

export default function Song({ song }: { song: SongType }) {
  const router = useRouter()
  const user = useAtomValue(userAtom)
  const setUserSongs = useSetAtom(userSongsAtom)

  const { mutate: deleteSong, isPending, error } = useDeleteSong()

  const handleDelete = (e: SyntheticEvent) => {
    e.stopPropagation()
    deleteSong(
      { songId: song.id, userId: user.id, tracks: song.tracks },
      {
        onSuccess: () => {
          console.log('Song and associated files deleted successfully.')
          setUserSongs((prev) => prev.filter((s) => s.id !== song.id))
        },
        onError: (err) => {
          console.error('Error deleting song:', err)
        },
      },
    )
  }

  const handleClick = (e: SyntheticEvent) => {
    router.push(`/songs/${song.id}`)
  }

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 2,
        width: 1,
        p: [1, 2],
        border: '1px dotted',
        borderColor: 'secondary.main',
        m: 2,
      }}
    >
      <List>
        <ListItem onClick={handleClick}>
          <Box>
            <Typography variant="h5">{song.name}</Typography>
          </Box>
          <Box>
            <Typography variant="h6">{song.artist}</Typography>
          </Box>
          <ListItemIcon>
            <Button onClick={handleDelete} disabled={isPending}>
              {isPending ? (
                'Deleting...'
              ) : (
                <DeleteForeverIcon sx={{ color: 'secondary.main' }} />
              )}
            </Button>
          </ListItemIcon>
        </ListItem>
      </List>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </Box>
  )
}
