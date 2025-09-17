import { useMutation } from '@tanstack/react-query'
import { downloadSessionMixdown } from '@/api/client'

const useDownloadSessionMixdown = () => {
  const mutationFn = async ({
    sessionId,
    stems,
    fileType,
  }: {
    sessionId: string
    stems: string[]
    fileType: string
  }) => {
    const response = await downloadSessionMixdown({
      path: { session_id: sessionId },
      body: {
        stems,
        file_type: fileType,
      },
      responseType: 'blob',
    })

    return response.data
  }

  const mutation = useMutation({
    mutationFn,
    onSuccess: (data) => {
      // Create a Blob and trigger the download
      // @ts-ignore
      const blob = new Blob([data], { type: 'application/zip' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'mixdown.zip' // Set the file name
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url) // Clean up URL object

      // Reset mutation state after successful download
      mutation.reset()
    },
    onError: (error) => {
      console.error('Error downloading mixdown:', error)
      // Reset mutation state after error
      mutation.reset()
    },
  })

  return mutation
}

export default useDownloadSessionMixdown
