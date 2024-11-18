'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createSong } from '@/api/client'
interface AddSongParams {
  file: Blob
  playlistId: number
  stems?: string[]
}

const addSong = async (params: AddSongParams) => {
  const { file, playlistId } = params

  const response = await createSong({
    body: { file },
    path: { playlist_id: playlistId },
  })

  return response.data
}

export default function useAddSong() {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: addSong,
    onSettled: (newData, error, { playlistId }) => {
      queryClient.invalidateQueries({ queryKey: ['songs', playlistId] })
    },
  })

  return mutation
}
