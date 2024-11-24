'use client'

import { useQuery } from '@tanstack/react-query'
import { getAllPlaylists } from '@/api/client'

export default function useGetPlaylists() {
  const fetchSongs = async () => {
    const response = await getAllPlaylists()

    return response?.data?.playlists
  }

  return useQuery({
    queryKey: ['playlists'],
    queryFn: fetchSongs,
  })
}
