'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '@/lib/supabase'

interface AddSongParams {
  name: string
  userId: string
}

const addPlaylist = async (params: AddSongParams) => {
  const { name, userId: user_id } = params

  const { data, error } = await supabase
    .from('playlist')
    .insert([{ name, user_id }])

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export default function useAddPlaylist() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: addPlaylist,
    onSettled: (newData, error, { userId }) => {
      const user = supabase.auth.getUser()
      queryClient.invalidateQueries(['playlists', userId])
    },
  })

  return mutation
}
