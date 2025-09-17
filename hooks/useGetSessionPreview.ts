'use client'

import { useQuery } from '@tanstack/react-query'
import { getSessionPreview } from '@/api/client'

export default function useGetSessionPreview(sessionId: string | null) {
  const fetchPreview = async () => {
    if (!sessionId) return null

    const response = await getSessionPreview({
      path: { session_id: sessionId },
    })

    return response.data
  }

  return useQuery({
    queryKey: ['sessionPreview', sessionId],
    queryFn: fetchPreview,
    enabled: !!sessionId,
  })
}
