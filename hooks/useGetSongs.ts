'use client'

import { getAllSongs } from '@/api/client'
import { useQuery } from '@tanstack/react-query'

export default function useGetSongs() {
  const fetchSong = async () => {
    const response = await getAllSongs()
    return response.data?.songs
  }

  return useQuery({
    queryKey: ['songs'],
    queryFn: fetchSong,
  })
}
