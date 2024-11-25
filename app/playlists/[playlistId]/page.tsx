'use client'

import SongList from '@/components/SongList'
import useGetPlaylist from '@/hooks/useGetPlaylist'
import { Box, FormGroup, FormLabel } from '@mui/material'
import { useParams } from 'next/navigation'
import EditableText from '@/components/EditableText'
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
      updatePlaylist({ playlistId: playlist?.id as number, title: newTitle })
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
        bgcolor: 'background.default',
      }}
    >
      <Box sx={{ p: 4 }}>
        <FormGroup>
          <FormLabel>Title</FormLabel>
          <EditableText
            value={playlist?.title || ''}
            placeholder="Playlist Title"
            onComplete={handleTitleUpdate}
            disabled={isUpdatePending}
            sx={{
              fontSize: 'h4.fontSize',
              fontWeight: 'bold',
            }}
          />
        </FormGroup>
      </Box>
      {songs && <SongList songs={songs} />}
    </Box>
  )
}
