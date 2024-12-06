'use client'

import { Box, Paper, Typography } from '@mui/material'
import MultiTrackPlayer from '../MultitrackPlayerV2'
import useSongById from '@/hooks/useGetSong'
import { useParams } from 'next/navigation'
import useUpdateSong from '@/hooks/useUpdateSong'
import EditableText from '../EditableText'

export default function SongDetail() {
  const params = useParams()

  const { data: song, isLoading, error } = useSongById(Number(params.songId))

  const { mutate: updateSong, isPending: isUpdateSongPending } = useUpdateSong()

  const handleArtistUpdate = (newArtist: string) => {
    if (newArtist !== song?.artist) {
      updateSong({
        song: {
          id: song?.id,
          artist: newArtist,
        },
      })
    }
  }

  const handleTitleUpdate = (newTitle: string) => {
    if (newTitle !== song?.title) {
      updateSong({
        song: {
          id: song?.id,
          title: newTitle,
        },
      })
    }
  }

  if (isLoading) {
    return <Typography>Loading...</Typography>
  }

  if (!song && !isLoading) {
    return (
      <Box
        sx={{
          height: '100%',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography fontSize={28}>Song not found</Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        borderRadius: 2,
        width: 1,
        height: 1,
        p: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          p: 2,
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        {song?.image_url && (
          <Paper
            sx={{
              backgroundImage: `url(${song?.image_url})`,
              width: '100px',
              height: '100px',
              backgroundSize: 'contain',
              flexShrink: 0,
            }}
          />
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <EditableText
            value={song?.title || ''}
            placeholder="Song Title"
            onComplete={handleTitleUpdate}
            disabled={isUpdateSongPending}
            sx={{ fontSize: 24 }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography>By:</Typography>
            <EditableText
              value={song?.artist || ''}
              placeholder="Artist Name"
              onComplete={handleArtistUpdate}
              disabled={isUpdateSongPending}
              sx={{ fontSize: 24 }}
            />
          </Box>
        </Box>
      </Box>

      {song && <MultiTrackPlayer tracks={song?.tracks} songId={song.id!} />}
    </Box>
  )
}
