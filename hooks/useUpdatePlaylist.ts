import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Playlist, updatePlaylist } from '@/api/client'

const useUpdatePlaylist = () => {
  const queryClient = useQueryClient()

  const mutationFn = async ({ playlist }: { playlist: Playlist }) => {
    const response = await updatePlaylist({
      path: { playlist_id: playlist.id as number },
      body: {
        title: playlist.title,
      },
    })

    return response.data
  }

  return useMutation({
    mutationFn,
    onSettled: (newData, error, { playlist }) => {
      queryClient.invalidateQueries({
        queryKey: ['playlist', playlist.id],
      })
    },
  })
}

export default useUpdatePlaylist
