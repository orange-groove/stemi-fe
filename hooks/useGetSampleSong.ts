'use client'

import { getSampleSong } from '@/api/client'
import { useQuery } from '@tanstack/react-query'

export default function useGetSampleSong() {
  const queryFn = async () => {
    const response = await getSampleSong()
    return response.data?.song
  }

  return useQuery({
    queryKey: ['song', 'sample'],
    queryFn,
  })
}
