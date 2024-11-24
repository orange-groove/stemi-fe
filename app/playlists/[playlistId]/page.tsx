'use client'

import SongList from '@/components/SongList'
import useGetPlaylist from '@/hooks/useGetPlaylist'
import { Box } from '@mui/material'
import { useParams } from 'next/navigation'
import EditableInput from '@/components/EditableInput'
import useUpdatePlaylist from '@/hooks/useUpdatePlaylist'
import useGetSongs from '@/hooks/useGetSongs'

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

  const { mutate: updatePlaylist, isPending: isUpdatePending } =
    useUpdatePlaylist()

  const handleTitleUpdate = (newTitle: string) => {
    if (newTitle !== playlist?.title) {
      updatePlaylist({ playlist: { id: playlist?.id, title: newTitle } })
    }
  }

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
      <Box sx={{ p: 4 }}>
        <EditableInput
          value={playlist?.title || ''}
          placeholder="Playlist Title"
          onComplete={handleTitleUpdate}
          disabled={isUpdatePending}
          sx={{
            fontSize: 'h4.fontSize',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: 1,
            px: 1,
          }}
        />
      </Box>
      {songs && <SongList songs={songs} />}
    </Box>
  )
}
