'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import config from '@/config'
interface AddSongParams {
  name: string
  artist?: string
  file: string
  userId: string
  playlistId: string
  stems?: string[]
}

const addSong = async (params: AddSongParams) => {
  const { name, artist, file, userId, playlistId } = params

  const formData = new FormData()
  formData.append('name', name)
  formData.append('artist', artist || '')
  formData.append('file', file)

  // Perform upload logic here
  const response = await fetch(
    `${config.baseApiUrl}/user/${userId}/playlist/${playlistId}/song`,
    {
      method: 'POST',
      body: formData,
    },
  )

  if (!response.ok) {
    throw new Error('Error uploading song')
  }

  const data = await response.json()

  return data
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
