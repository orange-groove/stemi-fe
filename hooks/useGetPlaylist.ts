'use client'

import { useQuery } from '@tanstack/react-query'
import { getPlaylist } from '@/api/client'

export default function useGetPlaylist(playlistId: number) {
  const fetchPlaylist = async () => {
    const response = await getPlaylist({ path: { playlist_id: playlistId } })

    return response.data?.playlist
  }

  return useQuery({
    queryKey: ['playlist', playlistId],
    enabled: !!playlistId,
    queryFn: fetchPlaylist,
  })
}
