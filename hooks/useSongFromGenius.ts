import { useQuery } from '@tanstack/react-query'
import { stringSimilarity } from 'string-similarity-js'

export default function useSearchSong(title?: string, artist?: string) {
  return useQuery({
    enabled: !!title && !!artist,
    queryKey: ['search-song', title, artist],
    queryFn: async () => {
      try {
        const res = await fetch(
          `https://api.genius.com/search?access_token=${process.env.NEXT_PUBLIC_GENIUS_ACCESS_TOKEN}&q=${encodeURIComponent(`${title}, ${artist}`)}`,
        )

        const jsonResult = await res.json()

        const song = jsonResult.response.hits.find(
          (hit: any) =>
            stringSimilarity(hit.result.primary_artist_names, artist || '') >
            0.6,
        )

        return song
      } catch (error) {
        console.error('Error:', error)
        return null
      }
    },
  })
}
