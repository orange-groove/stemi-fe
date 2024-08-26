import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import supabase from '@/lib/supabase' // Adjust the import to your supabase client path

const useDeleteSong = () => {
  const [error, setError] = useState(null)

  const deleteSong = async ({ songId, userId, tracks }) => {
    try {
      // Delete files from Supabase storage
      const bucketName = 'yoke-stems' // Adjust to your bucket name

      for (const track of tracks) {
        for (const file of track.files) {
          const filePath = file.url.split(bucketName + '/')[1] // Extract file path from the URL
          const { error: storageError } = await supabase.storage
            .from(bucketName)
            .remove([filePath])

          if (storageError) {
            throw new Error(
              `Error deleting file ${filePath}: ${storageError.message}`,
            )
          }
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
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    }
  }

  const mutation = useMutation({ mutationFn: deleteSong })

  return {
    ...mutation,
    error,
  }
}

export default useDeleteSong
