'use client'

import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material'
import useAddSong from '@/hooks/useAddSong'
import { useAtomValue } from 'jotai'
import { userAtom } from '@/state/user'
import LoadingButton from '../LoadingButton'

interface FormData {
  name: string
  url: FileList
}

const SongForm = () => {
  const [fileName, setFileName] = useState('')
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm()

  const addSongMutation = useAddSong()
  const user = useAtomValue(userAtom)

  const onSubmit = (data: FormData) => {}

  return (
    <Box
      component="form"
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
            multiline
            rows={4}
            error={!!errors.description}
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
                  field.onChange(e.target.files[0])
                  setFileName(e.target.files[0]?.name || '')
                }}
              />
            </Button>
            {fileName && <Typography>Selected file: {fileName}</Typography>}
          </>
        )}
      />
      {errors.file && (
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
