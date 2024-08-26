'use client'

import type { Song, Track } from '@/types'
import { Box, Button, List, ListItem, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import TrackComponent from '@/components/Track'
import useDeleteSong from '@/hooks/useDeleteSong'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { use } from 'react'
import { useAtomValue } from 'jotai'
import { userAtom } from '@/state/user'

export default function Song({ song }: { song: Song }) {
  const router = useRouter()
  const user = useAtomValue(userAtom)

  const { mutate: deleteSong, isPending, error } = useDeleteSong()

  const handleDelete = () => {
    deleteSong(
      { songId: song.id, userId: user.id, tracks: song.tracks },
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

  return (
    <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, width: 1, p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h4">{song.name}</Typography>
        </Box>
        <Box sx={{ display: 'flex' }}>
          <Button onClick={() => router.push(`/songs/${song.id}`)}>Mix</Button>
          <Button onClick={handleDelete} disabled={isPending}>
            {isPending ? (
              'Deleting...'
            ) : (
              <DeleteForeverIcon sx={{ color: 'secondary.main' }} />
            )}
          </Button>
          {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        </Box>
      </Box>
      <List disablePadding>
        {song?.tracks?.map((track: Track) => (
          <ListItem
            key={track.url}
            sx={{ display: 'flex', justifyContent: 'space-between' }}
          >
            <Typography variant="subtitle1" sx={{ width: '100px' }}>
              {track.name}
            </Typography>
            <TrackComponent track={track} />
          </ListItem>
        ))}
      </List>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </Box>
  )
}
