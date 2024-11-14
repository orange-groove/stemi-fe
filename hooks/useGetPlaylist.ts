'use client'

import supabase from '@/lib/supabase'
import { useAtomValue } from 'jotai'
import { userAtom } from '@/state/user'
import { useQuery } from '@tanstack/react-query'

export default function useGetPlaylist(playlistId: string) {
  const user = useAtomValue(userAtom)

  const fetchPlaylist = async () => {
    const response = await supabase
      .from('playlist')
      .select('*')
      .eq('id', playlistId)
      .single()

    return response.data
  }

  return useQuery({
    queryKey: ['playlist', playlistId],
    enabled: !!user?.id && !!playlistId,
    queryFn: fetchPlaylist,
  })
}
