import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '@/lib/supabase'

const useDeletePlaylist = () => {
  const [error, setError] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const deletePlaylist = async ({
    playlistId,
  }: {
    playlistId: string
    userId: string
  }) => {
    try {
      // Retrieve songs for the playlist to delete them from storage
      const { data: songs, error: songsFetchError } = await supabase
        .from('song')
        .select('id')
        .eq('playlist_id', playlistId)

      if (songsFetchError) {
        throw new Error(`Error fetching songs: ${songsFetchError.message}`)
      }

      // Delete each song's data from the Supabase storage bucket
      for (const song of songs) {
        const path = `${playlistId}/${song.id}/`
        const { error: storageError } = await supabase.storage
          .from('yoke-stems')
          .remove([path])

        if (storageError) {
          throw new Error(
            `Error deleting bucket data for song ${song.id}: ${storageError.message}`,
          )
        }
      }

      // Delete the songs from the 'song' table
      const { error: songsDeleteError } = await supabase
        .from('song')
        .delete()
        .eq('playlist_id', playlistId)

      if (songsDeleteError) {
        throw new Error(`Error deleting songs: ${songsDeleteError.message}`)
      }

      // Delete the playlist from the 'playlist' table
      const { error: playlistDeleteError } = await supabase
        .from('playlist')
        .delete()
        .eq('id', playlistId)

      if (playlistDeleteError) {
        throw new Error(
          `Error deleting playlist: ${playlistDeleteError.message}`,
        )
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
