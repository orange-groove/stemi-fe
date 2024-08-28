'use client'

import { useMutation } from '@tanstack/react-query'

interface AddSongParams {
  name: string
  artist?: string
  file: string
  userId: string
  stems?: string[]
}

const addSong = async (params: AddSongParams) => {
  const { name, artist, file, userId: user_id } = params

  const formData = new FormData()
  formData.append('name', name)
  formData.append('artist', artist || '')
  formData.append('file', file)
  formData.append('user_id', user_id)

  // Perform upload logic here
  const response = await fetch(
    `http://localhost:5000/api/v1/user/${user_id}/song`,
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
  const mutation = useMutation({
    mutationFn: addSong,
  })

  return mutation
}
