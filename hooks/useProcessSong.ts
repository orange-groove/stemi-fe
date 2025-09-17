'use client'

import { useMutation } from '@tanstack/react-query'
import { processSong } from '@/api/client'

interface ProcessSongParams {
  file: File
}

const processSongFn = async (params: ProcessSongParams) => {
  const { file } = params

  const response = await processSong({
    body: { file },
  })

  return response.data
}

export default function useProcessSong() {
  const mutation = useMutation({
    mutationFn: processSongFn,
  })

  return mutation
}
