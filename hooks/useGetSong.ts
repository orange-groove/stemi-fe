'use client'

import { getSong } from '@/api/client'
import { useQuery } from '@tanstack/react-query'

export default function useGetSong(songId: string) {
  const fetchSong = async () => {
    const response = await getSong({ path: { song_id: songId } })
    return response.data?.song
  }

  return useQuery({
    queryKey: ['songs', songId],
    queryFn: fetchSong,
    enabled: !!songId,
  })
}
