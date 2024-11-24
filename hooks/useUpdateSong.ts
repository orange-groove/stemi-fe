import { useMutation } from '@tanstack/react-query'
import { Song, updateSong } from '@/api/client'

const useUpdateSong = () => {
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
  })
}

export default useUpdateSong
