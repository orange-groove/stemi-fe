'use client'

import SongList from '@/components/SongList'
import useGetPlaylist from '@/hooks/useGetPlaylist'
import useGetSongs from '@/hooks/useGetSongs'
import { Box, Typography } from '@mui/material'
import { useParams } from 'next/navigation'

export default function PlaylistDetailPage() {
  const params = useParams()

  const {
    data: playlist,
    error: playlistError,
    isLoading: playlistIsLoading,
  } = useGetPlaylist(Number(params.playlistId))

  const {
    data: songs,
    error: songsError,
    isLoading: songsIsLoading,
  } = useGetSongs(Number(params.playlistId))

  if (playlistIsLoading || songsIsLoading) return <div>Loading...</div>

  if (playlistError) return <div>Error: {playlistError.message}</div>
  if (songsError) return <div>Error: {songsError.message}</div>

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
      {songs && <SongList songs={songs} />}
    </Box>
  )
}
