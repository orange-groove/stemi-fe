'use client'

import { Box, Typography } from '@mui/material'
import MultiTrackPlayer from '../MultiTrackPlayer'
import useSongById from '@/hooks/useGetSong'
import { useParams } from 'next/navigation'

export default function SongDetail() {
  const params = useParams()

  const { song, loading, error } = useSongById(params.songId as string)

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 2,
        width: 'calc(100% - 100px)',
        height: 1,
        p: 2,
      }}
    >
      <Typography variant="h4">{song?.name}</Typography>
      <Typography variant="h5">{song?.description}</Typography>
      <MultiTrackPlayer
        urls={song?.tracks?.map((track) => track.url) || []}
        songId={params.songId}
      />
    </Box>
  )
}
