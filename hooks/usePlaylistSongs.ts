'use client'

import { getPlaylistSongs } from '@/api/client'
import { useQuery } from '@tanstack/react-query'

export default function usePlaylistSongs(playlistId: number) {
  const fetchSong = async () => {
    const response = await getPlaylistSongs({
      path: { playlist_id: playlistId },
    })
    return response.data?.songs?.map((song) => song.songs)
  }

  return useQuery({
    queryKey: ['playlist', 'songs', playlistId],
    queryFn: fetchSong,
    enabled: !!playlistId,
  })
}
