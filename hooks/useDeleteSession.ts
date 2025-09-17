'use client'

import { useMutation } from '@tanstack/react-query'
import { deleteSession } from '@/api/client'

interface DeleteSessionParams {
  sessionId: string
}

const deleteSessionFn = async (params: DeleteSessionParams) => {
  const { sessionId } = params

  const response = await deleteSession({
    path: { session_id: sessionId },
  })

  return response.data
}

export default function useDeleteSession() {
  const mutation = useMutation({
    mutationFn: deleteSessionFn,
  })

  return mutation
}
