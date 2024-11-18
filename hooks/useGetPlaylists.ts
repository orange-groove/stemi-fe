'use client'

import { useQuery } from '@tanstack/react-query'
import { getAllPlaylists } from '@/api/client'
import { useAtomValue } from 'jotai'
import { userAtom } from '@/state/user'

export default function useGetPlaylists() {
  const user = useAtomValue(userAtom)

  const fetchSongs = async () => {
    if (user?.id) {
      const response = await getAllPlaylists({ query: { user_id: user?.id } })

      return response.data?.playlists
    }
  }

  return useQuery({
    queryKey: ['playlists', user?.id],
    queryFn: fetchSongs,
  })
}
