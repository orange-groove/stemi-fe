'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createSong } from '@/api/client'
interface AddSongParams {
  file?: File
  youtube_url?: string
}

const addSong = async (params: AddSongParams) => {
  const { file, youtube_url } = params

  const response = await createSong({
    body: { file, youtube_url },
  })

  return response.data
}

export default function useAddSong() {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: addSong,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['songs'] })
    },
  })

  return mutation
}
