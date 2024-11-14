'use client'

import supabase from '@/lib/supabase'
import { useAtomValue } from 'jotai'
import { userAtom } from '@/state/user'
import { useQuery } from '@tanstack/react-query'

export default function useGetSong(songId: string) {
  const user = useAtomValue(userAtom)

  const fetchSong = async () => {
    const response = await supabase
      .from('song')
      .select('*')
      .eq('id', songId)
      .single()

    return response.data
  }

  return useQuery({
    queryKey: ['song', songId],
    queryFn: fetchSong,
    enabled: !!user?.id && !!songId,
  })
}
