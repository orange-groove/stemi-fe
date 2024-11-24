import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteSong, Song, updateSong } from '@/api/client'

const useUpdateSong = () => {
  const queryClient = useQueryClient()

  const mutationFn = async ({ song }: { song: Song }) => {
    const response = await updateSong({
      path: { song_id: song.id as string },
      body: {
        title: song.title,
        artist: song.artist,
      },
    })

    return response.data
  }

  return useMutation({
    mutationFn,
    onSettled: (newData, error, { song }) => {
      queryClient.invalidateQueries({
        queryKey: ['playlist', song.playlist_id],
      })
    },
  })
}

export default useUpdateSong
