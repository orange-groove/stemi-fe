'use client'

import { Box, Button, List, ListItem, Paper, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import useDeleteSong from '@/hooks/useDeleteSong'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { useAtomValue, useSetAtom } from 'jotai'
import { userAtom } from '@/state/user'
import { userSongsAtom } from '@/state/song'
import { Song as SongType } from '@/types'
import { SyntheticEvent } from 'react'
import useSongFromGenius from '@/hooks/useSongFromGenius'

export default function Song({ song }: { song: SongType }) {
  const router = useRouter()
  const user = useAtomValue(userAtom)
  const setUserSongs = useSetAtom(userSongsAtom)

  const { data: geniusSongData, isFetching } = useSongFromGenius(
    song?.name,
    song?.artist,
  )

  const { mutate: deleteSong, isPending, error } = useDeleteSong()

  const handleDelete = (e: SyntheticEvent) => {
    e.stopPropagation()
    user?.id &&
      song?.tracks &&
      deleteSong(
        { songId: song.id, userId: user.id, tracks: song.tracks },
        {
          onSuccess: () => {
            console.log('Song and associated files deleted successfully.')
            setUserSongs((prev) => prev.filter((s: any) => s?.id !== song?.id))
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
        border: '3px dashed',
        borderColor: 'secondary.main',
        m: 2,
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <Button
          onClick={handleDelete}
          disabled={isPending}
          sx={{ position: 'absolute', top: 6, right: 6 }}
        >
          {isPending ? (
            'Deleting...'
          ) : (
            <DeleteForeverIcon sx={{ color: 'secondary.main', fontSize: 60 }} />
          )}
        </Button>
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
            </Box>
          </Box>
        </ListItem>
      </List>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </Box>
  )
}
