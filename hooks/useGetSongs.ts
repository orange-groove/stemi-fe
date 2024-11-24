'use client'

import { getPlaylistSongs } from '@/api/client'
import { useQuery } from '@tanstack/react-query'

export default function useGetSong(playlistId: number) {
  const fetchSong = async () => {
    const response = await getPlaylistSongs({
      path: { playlist_id: playlistId },
    })
    return response.data?.songs
  }

  return useQuery({
    queryKey: ['songs', playlistId],
    queryFn: fetchSong,
    enabled: !!playlistId,
  })
}
