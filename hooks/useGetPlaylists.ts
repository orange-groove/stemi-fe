'use client'

import supabase from '@/lib/supabase'
import { useAtomValue } from 'jotai'
import { userAtom } from '@/state/user'
import { useQuery } from '@tanstack/react-query'

interface Song {
  id: string
  name: string
  artist: string
  created_at: string
  user_id: string
}

export default function useGetPlaylists() {
  const user = useAtomValue(userAtom)

  const fetchSongs = async () => {
    const response = await supabase
      .from('playlist')
      .select('*')
      .eq('user_id', user?.id)

    return response.data
  }

  return useQuery({
    queryKey: ['playlists', user?.id],
    queryFn: fetchSongs,
    enabled: !!user?.id,
  })
}
