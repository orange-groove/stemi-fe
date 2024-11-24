'use client'

import SongList from '@/components/SongList'
import useGetPlaylist from '@/hooks/useGetPlaylist'
import { Box, Typography } from '@mui/material'
import { useParams } from 'next/navigation'

export default function PlaylistDetailPage() {
  const params = useParams()

  const {
    data: playlist,
    error: playlistError,
    isLoading: playlistIsLoading,
  } = useGetPlaylist(Number(params.playlistId))

  if (playlistIsLoading) return <div>Loading...</div>

  if (playlistError) return <div>Error: {playlistError.message}</div>

  return (
    <Box
      sx={{
        height: '100vh',
        width: 1,
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="h4" sx={{ p: 4 }}>
        Playlist: {playlist?.name}
      </Typography>
      {playlist?.songs && <SongList songs={playlist.songs} />}
    </Box>
  )
}
