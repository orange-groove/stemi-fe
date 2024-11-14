'use client'

import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Box, TextField, Typography } from '@mui/material'
import { useAtomValue, useSetAtom } from 'jotai'
import { userAtom } from '@/state/user'
import LoadingButton from '../LoadingButton'
import { userSongsAtom } from '@/state/song'
import useAddPlaylist from '@/hooks/useAddPlaylist'
import { playlistsAtom } from '@/state/playlist'

interface Props {
  onComplete: () => void
}
interface FormData {
  name: string
  artist: string
  file: FileList
  stems: string[]
}

const PlaylistForm = ({ onComplete }: Props) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm()

  const addPlaylistMutation = useAddPlaylist()
  const user = useAtomValue(userAtom)
  const setPlaylists = useSetAtom(playlistsAtom)

  const onSubmit = (data: FormData) => {
    addPlaylistMutation.mutate(
      {
        name: data.name,
        userId: user?.id as any,
      },
      {
        onSuccess: (data) => {
          console.log('Success:', data)
          reset()
          onComplete()
          // @ts-ignore
          setPlaylists((prev) => [...prev, data.playlist_entry])
        },
        onError: (error) => {
          console.error('Error:', error)
        },
      },
    )
  }

  return (
    <Box
      component="form"
      // @ts-ignore
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{ mt: 3 }}
    >
      <Controller
        name="name"
        control={control}
        defaultValue=""
        rules={{ required: 'Name is required' }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            error={!!errors.name}
          />
        )}
      />

      {errors.file && (
        // @ts-ignore
        <Typography style={{ color: 'red' }}>{errors.file.message}</Typography>
      )}

      <LoadingButton
        type="submit"
        isLoading={addPlaylistMutation.isPending}
        loadingText="Processing... Please wait."
        fullWidth
        variant="contained"
        color="primary"
      >
        Add Playlist
      </LoadingButton>
    </Box>
  )
}

export default PlaylistForm
