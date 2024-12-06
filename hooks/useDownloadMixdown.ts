import { useMutation } from '@tanstack/react-query'
import { downloadMixdown } from '@/api/client'

const useDownloadMixdown = () => {
  const mutationFn = async ({
    songId,
    stems,
    fileType,
  }: {
    songId: number
    stems: string[]
    fileType: string
  }) => {
    const response = await downloadMixdown({
      path: { song_id: songId! },
      body: {
        stems,
        file_type: fileType,
      },
      responseType: 'blob',
    })

    return response.data
  }

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      // Create a Blob and trigger the download
      // @ts-ignore
      const blob = new Blob([data], { type: 'application/zip' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'stems.zip' // Set the file name
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url) // Clean up URL object
    },
    onError: (error) => {
      console.error('Error downloading stems:', error)
    },
  })
}

export default useDownloadMixdown
