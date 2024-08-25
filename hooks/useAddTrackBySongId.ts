import { useMutation } from '@tanstack/react-query'
import supabase from '@/lib/supabase'

export const mutationFn = async ({
  userId,
  songId,
  trackName,
  file,
  offset,
}) => {
  try {
    // Define the bucket and file path
    const bucketName = 'yoke-stems'
    const filePath = `${userId}/${songId}/${trackName}.mp3`

    // Upload the file to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file)

    if (uploadError) {
      throw new Error(`Failed to upload track: ${uploadError.message}`)
    }

    // Get the public URL of the uploaded file
    const { data: publicURLData, error: urlError } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath)

    if (urlError) {
      throw new Error(`Failed to get public URL: ${urlError.message}`)
    }

    const publicURL = publicURLData.publicUrl

    // Fetch the current 'tracks' array
    const { data: songData, error: fetchError } = await supabase
      .from('song')
      .select('tracks')
      .eq('id', songId)
      .single()

    if (fetchError) {
      throw new Error(`Failed to fetch song: ${fetchError.message}`)
    }

    const currentTracks = songData.tracks || []

    // Append the new track to the 'tracks' array
    const updatedTracks = [
      ...currentTracks,
      { name: trackName, url: publicURL, offset },
    ]

    // Update the 'tracks' field in the 'songs' table
    const { data: updateData, error: updateError } = await supabase
      .from('song')
      .update({ tracks: updatedTracks })
      .eq('id', songId)
      .select()

    if (updateError) {
      throw new Error(`Failed to update song entry: ${updateError.message}`)
    }

    return updateData
  } catch (error) {
    console.error('Error uploading track and updating song:', error.message)
    throw error
  }
}

export const useAddTrackBySongId = () => {
  return useMutation({
    mutationFn,
  })
}
