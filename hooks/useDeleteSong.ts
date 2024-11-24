import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteSong, Song } from '@/api/client'

const useDeleteSong = () => {
  const queryClient = useQueryClient()

  const mutationFn = async ({ song }: { song: Song }) => {
    const response = await deleteSong({ path: { song_id: song.id } })

    return response.data
  }

  return useMutation({
    mutationFn,
    onSettled: (newData, error, { song }) => {
      queryClient.invalidateQueries({
        queryKey: ['playlists', song.playlist_id],
      })
    },
  })
}

export default useDeleteSong
