'use client'

import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Box, TextField, Typography } from '@mui/material'
import { useAtomValue } from 'jotai'
import { userAtom } from '@/state/user'
import LoadingButton from '../LoadingButton'
import useAddPlaylist from '@/hooks/useAddPlaylist'

interface Props {
  onComplete: () => void
}
interface FormData {
  title: string
}

const PlaylistForm = ({ onComplete }: Props) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm()

  const addPlaylistMutation = useAddPlaylist()

  const onSubmit = (data: FormData) => {
    addPlaylistMutation.mutate(
      {
        title: data.title,
      },
      {
        onSuccess: (data) => {
          console.log('Success:', data)
          reset()
          onComplete()
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
        name="title"
        control={control}
        defaultValue=""
        rules={{ required: 'Title is required' }}
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
