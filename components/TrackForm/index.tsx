'use client'

import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Box, TextField, Button, Typography } from '@mui/material'
import useAddSong from '@/hooks/useAddSong'
import LoadingButton from '../LoadingButton'
import { useRouter } from 'next/navigation'

const SongForm = () => {
  const [fileName, setFileName] = useState('')
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm()
  const router = useRouter()

  const addSongMutation = useAddSong()

  useEffect(() => {
    if (addSongMutation.isSuccess) {
      setFileName('')
      router.push(`/songs/${addSongMutation.data.id}`)
    }
  }, [addSongMutation.isSuccess])

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
            // @ts-ignore
            helperText={errors.name ? errors.name.message : ''}
          />
        )}
      />

      <Controller
        name="description"
        control={control}
        defaultValue=""
        rules={{ required: 'Description is required' }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Description"
            variant="outlined"
            fullWidth
            margin="normal"
            error={!!errors.description}
            // @ts-ignore
            helperText={errors.description ? errors.description.message : ''}
          />
        )}
      />

      <Controller
        name="file"
        control={control}
        rules={{ required: 'File is required' }}
        render={({ field }) => (
          <>
            <Button
              variant="contained"
              component="label"
              fullWidth
              sx={{ mt: 2, mb: 2 }}
            >
              Upload File
              <input
                type="file"
                hidden
                accept="audio/*"
                onChange={(e) => {
                  // @ts-ignore
                  field.onChange(e.target.files[0])
                  // @ts-ignore
                  setFileName(e.target.files[0]?.name || '')
                }}
              />
            </Button>
            {fileName && <Typography>Selected file: {fileName}</Typography>}
          </>
        )}
      />
      {errors.file && (
        // @ts-ignore
        <Typography style={{ color: 'red' }}>{errors.file.message}</Typography>
      )}

      <LoadingButton
        type="submit"
        isLoading={addSongMutation.isPending}
        loadingText="Processing... Please wait."
        fullWidth
        variant="contained"
        color="primary"
      >
        Submit
      </LoadingButton>
    </Box>
  )
}

export default SongForm
