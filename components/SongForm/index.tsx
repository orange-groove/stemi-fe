'use client'

import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
} from '@mui/material'
import useAddSong from '@/hooks/useAddSong'
import { useAtomValue } from 'jotai'
import { userAtom } from '@/state/user'
import LoadingButton from '../LoadingButton'

interface FormData {
  name: string
  description: string
  file: FileList
  stems: string[]
}
const stemOptions = ['vocals', 'bass', 'drums', 'other']

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

  const onSubmit = (data: FormData) => {
    addSongMutation.mutate(
      {
        name: data.name,
        description: data.description,
        file: data.file, // Ensure the file is correctly passed
        stems: data.stems, // Pass the selected stems
        userId: user?.id,
      },
      {
        onSuccess: (data) => {
          console.log('Success:', data)
          reset()
          setFileName('')
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
        name="stems"
        control={control}
        defaultValue={[]}
        rules={{ required: 'At least one stem must be selected' }}
        render={({ field }) => (
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Stems to Separate</InputLabel>
            <Select
              {...field}
              multiple
              renderValue={(selected) => selected.join(', ')}
              error={!!errors.stems}
            >
              {stemOptions?.map((option) => (
                <MenuItem key={option} value={option}>
                  <Checkbox checked={field.value.indexOf(option) > -1} />
                  <ListItemText primary={option} />
                </MenuItem>
              ))}
            </Select>
            {errors.stems && (
              <Typography style={{ color: 'red' }}>
                {errors.stems.message}
              </Typography>
            )}
          </FormControl>
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
        isLoading={!addSongMutation.isPending}
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
