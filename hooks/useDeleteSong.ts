import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import supabase from '@/lib/supabase' // Adjust the import to your supabase client path
import { Track } from '@/types'

const useDeleteSong = () => {
  const [error, setError] = useState<string | null>(null)

  const deleteSong = async ({
    songId,
    userId,
    tracks,
  }: {
    songId: string
    userId: string
    tracks: Track[]
  }) => {
    try {
      const bucketName = 'yoke-stems' // Adjust to your bucket name

      // Iterate over each track
      for (const track of tracks) {
        const fileUrl = track.url
        console.log(`Processing file URL: ${fileUrl}`)

        const filePath = fileUrl.split(`${bucketName}/`)[1] // Extract the path after the bucket name
        console.log(`Extracted file path: ${filePath}`)

        if (!filePath) {
          throw new Error(`Invalid file path for track: ${fileUrl}`)
        }

        console.log(`Deleting file at path: ${filePath}`)

        // Remove the file from Supabase storage
        const { error: storageError } = await supabase.storage
          .from(bucketName)
          .remove([filePath])

        if (storageError) {
          console.error(
            `Error deleting file ${filePath}: ${storageError.message}`,
          )
          throw new Error(
            `Error deleting file ${filePath}: ${storageError.message}`,
          )
        } else {
          console.log(`File ${filePath} deleted successfully`)
        }
      }

      // Delete the song entry from the 'song' table
      const { error: deleteError } = await supabase
        .from('song')
        .delete()
        .eq('id', songId)
        .eq('user_id', userId)

      if (deleteError) {
        throw new Error(`Error deleting song entry: ${deleteError.message}`)
      }

      return { success: true }
    } catch (err: any) {
      console.error('Error in deleteSong:', err)
      setError(err.message)
      return { success: false, error: err.message }
    }
  }

  const mutation = useMutation({
    mutationFn: deleteSong,
    onSuccess: (data) => {
      console.log('onSuccess called', data)
    },
    onError: (err) => {
      console.error('onError called', err)
    },
  })

  return {
    ...mutation,
    error,
  }
}

export default useDeleteSong
