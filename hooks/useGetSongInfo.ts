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
          `http://localhost:5000/api/v1/user/${user_id}/song/info?name=${name}&artist=${artist}`,
        )

        const jsonResult = await res.json()

        const info = JSON.parse(jsonResult.info).content

        return info
      } catch (error) {
        console.error('Error:', error)
        return null
      }
    },
  })
}
