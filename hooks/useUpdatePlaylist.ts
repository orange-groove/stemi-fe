import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Playlist, updatePlaylist } from '@/api/client'

const useUpdatePlaylist = () => {
  const queryClient = useQueryClient()

  const mutationFn = async ({
    playlistId,
    title,
  }: {
    playlistId: number
    title: string
  }) => {
    const response = await updatePlaylist({
      path: { playlist_id: playlistId },
      body: {
        title,
      },
    })

    return response.data
  }

  return useMutation({
    mutationFn,
    onSettled: (newData, error, { playlistId }) => {
      queryClient.invalidateQueries({
        queryKey: ['playlist', playlistId],
      })
    },
  })
}

export default useUpdatePlaylist
