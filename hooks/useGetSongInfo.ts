import config from '@/config'
import { useQuery } from '@tanstack/react-query'

export default function useGetSongInfo(
  user_id: string,
  title: string,
  artist: string,
) {
  console.log('genius data', title, artist)
  return useQuery({
    enabled: !!title && !!artist,
    queryKey: ['song-info-text', title, artist],
    queryFn: async () => {
      try {
        const res = await fetch(
          `${config.baseApiUrl}/user/${user_id}/song/info?name=${title}&artist=${artist}`,
        )

        const jsonResult = await res.json()

        const info = jsonResult.info.content
        // const popups = jsonResult.popups.content

        return { info }
      } catch (error) {
        console.error('Error:', error)
        return null
      }
    },
  })
}
