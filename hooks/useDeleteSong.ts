import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteSong } from '@/api/client'

const useDeleteSong = () => {
  const queryClient = useQueryClient()

  const mutationFn = async ({
    songId,
  }: {
    songId: string
    playlistId: string
  }) => {
    deleteSong({ path: { song_id: songId } })
  }

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      console.log('onSuccess called', data)
    },
    onError: (err) => {
      console.error('onError called', err)
    },
    onSettled: (newData, error, { playlistId }) => {
      queryClient.invalidateQueries({ queryKey: ['songs', playlistId] })
    },
  })
}

export default useDeleteSong
