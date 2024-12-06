import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteSong, Song } from '@/api/client'

const useDeleteSong = () => {
  const queryClient = useQueryClient()

  const mutationFn = async (id: number) => {
    const response = await deleteSong({ path: { song_id: id } })

    return response.data
  }

  return useMutation({
    mutationFn,
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['songs'],
      })
    },
  })
}

export default useDeleteSong
