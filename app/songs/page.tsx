'use client'

import SongList from '@/components/SongList'
import useGetSongs from '@/hooks/useGetSongs'
import { Box } from '@mui/material'

export default function SongsPage() {
  const { data: songs, error, isLoading } = useGetSongs()

  if (isLoading) return <div>Loading...</div>

  if (error) return <div>Error: {error.message}</div>

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {songs && <SongList songs={songs} />}
    </Box>
  )
}
