'use client'

import SongList from '@/components/SongList'
import useGetSongs from '@/hooks/useGetSongs'
import { Box } from '@mui/material'
import { useParams } from 'next/navigation'

export default function PlaylistDetailPage() {
  const params = useParams()

  const {
    data: songs,
    error,
    isLoading,
  } = useGetSongs(params.playlistId as string)

  if (isLoading) return <div>Loading...</div>

  if (error) return <div>Error: {error.message}</div>

  return (
    <Box
      sx={{
        height: '100vh',
        width: 1,
        bgcolor: 'background.paper',
      }}
    >
      {songs && <SongList songs={songs} />}
    </Box>
  )
}
