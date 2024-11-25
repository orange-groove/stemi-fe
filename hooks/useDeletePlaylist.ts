import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deletePlaylist } from '@/api/client'

const useDeletePlaylist = () => {
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

  return useMutation({
    mutationFn,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] })
    },
  })
}

export default useDeletePlaylist
