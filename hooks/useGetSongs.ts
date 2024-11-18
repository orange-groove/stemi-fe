'use client'

import supabase from '@/lib/supabase'
import { useQuery } from '@tanstack/react-query'

export default function useGetSongs(playlistId: number) {
  const fetchSongs = async () => {
    const response = await supabase
      .from('song')
      .select('*')
      .eq('playlist_id', playlistId)

    return response.data
  }

  return useQuery({
    queryKey: ['songs', playlistId],
    queryFn: fetchSongs,
    enabled: !!playlistId,
  })
}
