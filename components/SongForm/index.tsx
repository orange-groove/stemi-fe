'use client'

import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import {
  Box,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
} from '@mui/material'
import useAddSong from '@/hooks/useAddSong'
import LoadingButton from '../LoadingButton'
import { useParams } from 'next/navigation'

interface Props {
  onComplete: () => void
}
interface FormData {
  file: FileList
}
const stemOptions = ['vocals', 'bass', 'drums', 'other']

const SongForm = ({ onComplete }: Props) => {
  const [fileName, setFileName] = useState('')
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm()

  const addSongMutation = useAddSong()

  const onSubmit = (data: FormData) => {
    addSongMutation.mutate(
      {
        file: data.file as any, // Ensure the file is correctly passed
      },
      {
        onSuccess: (data) => {
          console.log('Success:', data)
          reset()
          setFileName('')
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
        Upload Song
      </LoadingButton>
    </Box>
  )
}

export default SongForm
