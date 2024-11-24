'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPlaylist } from '@/api/client'

interface AddPlaylistParams {
  title: string
}

const addPlaylist = async (params: AddPlaylistParams) => {
  const { title } = params

  const response = await createPlaylist({ body: { title } })

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
