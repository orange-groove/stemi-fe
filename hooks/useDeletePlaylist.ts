import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '@/lib/supabase'

const useDeletePlaylist = () => {
  const [error, setError] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const deletePlaylist = async ({
    playlistId,
    userId,
  }: {
    playlistId: string
    userId: string
  }) => {
    try {
      // Delete the entry from the 'playlist' table
      const { error: deleteError } = await supabase
        .from('playlist')
        .delete()
        .eq('id', playlistId)
        .eq('user_id', userId)

      if (deleteError) {
        throw new Error(`Error deleting playlist entry: ${deleteError.message}`)
      }

      return { success: true }
    } catch (err: any) {
      console.error('Error in deletePlaylist:', err)
      setError(err.message)
      return { success: false, error: err.message }
    }
  }

  const mutation = useMutation({
    mutationFn: deletePlaylist,
    onSuccess: (data) => {
      console.log('onSuccess called', data)
    },
    onError: (err) => {
      console.error('onError called', err)
    },
    onSettled: (newData, error, { playlistId }) => {
      const user = supabase.auth.getUser()
      queryClient.invalidateQueries(['playlists', user?.id])
    },
  })

  return {
    ...mutation,
    error,
  }
}

export default useDeletePlaylist
