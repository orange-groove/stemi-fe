'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPlaylist } from '@/api/client'

interface AddSongParams {
  name: string
  userId: string
}

const addPlaylist = async (params: AddSongParams) => {
  const { name } = params

  const response = await createPlaylist({ body: { name } })

  return response.data
}

export default function useAddPlaylist() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: addPlaylist,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] })
    },
  })

  return mutation
}
