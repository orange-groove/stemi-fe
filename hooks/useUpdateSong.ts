import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Song, updateSong } from '@/api/client'

const useUpdateSong = () => {
  const queryClient = useQueryClient()
  const mutationFn = async ({ song }: { song: Song }) => {
    const response = await updateSong({
      path: { song_id: song.id! },
      body: {
        title: song.title,
        artist: song.artist,
      },
    })

    return response.data
  }

  return useMutation({
    mutationFn,
    onSettled: (data, error, { song }) => {
      // Invalidate the query to refetch the updated song
      queryClient.invalidateQueries({ queryKey: ['songs', song.id] })
    },
  })
}

export default useUpdateSong
