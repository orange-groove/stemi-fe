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
      sx={{ background: 'white', borderRadius: 2, width: 1, height: 1, p: 2 }}
    >
      <Typography variant="h4">{song?.name}</Typography>
      <Typography variant="h5">{song?.description}</Typography>
      <MultiTrackPlayer urls={song?.tracks?.map((track) => track.url) || []} />
    </Box>
  )
}
