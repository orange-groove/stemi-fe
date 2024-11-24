import { mutationFn } from './useAddTrackBySongId'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deletePlaylist } from '@/api/client'

const useDeletePlaylist = () => {
  const [error, setError] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const mutationFn = async ({
    playlistId,
  }: {
    playlistId: number
    userId: string
  }) => {
    const response = await deletePlaylist({
      path: {
        playlist_id: playlistId,
      },
    })

    return response.data
  }

  const mutation = useMutation({
    mutationFn,
    onSuccess: (data) => {
      console.log('onSuccess called', data)
    },
    onError: (err) => {
      console.error('onError called', err)
    },
    onSettled: async (newData, error, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: ['playlists', userId],
      })
    },
  })

  return {
    ...mutation,
    error,
  }
}

export default useDeletePlaylist
