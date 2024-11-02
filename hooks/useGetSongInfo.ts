import { pink } from '@mui/material/colors'
import config from '@/config'
import { useQuery } from '@tanstack/react-query'

export default function useGetSongInfo(
  user_id: string,
  name: string,
  artist: string,
) {
  console.log('genius data', name, artist)
  return useQuery({
    enabled: !!name && !!artist,
    queryKey: ['song-info-text', name, artist],
    queryFn: async () => {
      try {
        const res = await fetch(
          `${config.baseApiUrl}/user/${user_id}/song/info?name=${name}&artist=${artist}`,
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
