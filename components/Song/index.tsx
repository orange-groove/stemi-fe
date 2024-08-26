'use client'

import { Box, Button, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import useDeleteSong from '@/hooks/useDeleteSong'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { useAtomValue, useSetAtom } from 'jotai'
import { userAtom } from '@/state/user'
import { userSongsAtom } from '@/state/song'
import MultiTrackPlayer from '../MultiTrackPlayer2'
import { Song as SongType } from '@/types'

export default function Song({ song }: { song: SongType }) {
  const router = useRouter()
  const user = useAtomValue(userAtom)
  const setUserSongs = useSetAtom(userSongsAtom)

  const { mutate: deleteSong, isPending, error } = useDeleteSong()

  const handleDelete = () => {
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

  return (
    <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, width: 1, p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h4">{song.name}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={() => router.push(`/songs/${song.id}`)}>Jam</Button>
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
      <MultiTrackPlayer song={song} />
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </Box>
  )
}
