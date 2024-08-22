'use client'

import { useQuery, useMutation } from '@tanstack/react-query'

export function useUploadSong() {
  return useMutation({
    mutationFn: async (formData: any) => {
      const res = await fetch('api/v1/songs', {
        method: 'POST',
        body: formData,
      })

      return await res.json()
    },
  })
}

export function useGetSongs() {
  return useQuery({
    queryKey: ['get-songs'],
    queryFn: async () => {
      const res = await fetch('api/v1/songs')
      return await res.json()
    },
  })
}
