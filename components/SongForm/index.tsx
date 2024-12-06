'use client'

import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Box, Typography, TextField } from '@mui/material'
import { useDropzone } from 'react-dropzone'
import useAddSong from '@/hooks/useAddSong'
import LoadingButton from '../LoadingButton'

interface Props {
  onComplete: () => void
}

interface FormData {
  file?: File
  youtube_url?: string
}

const SongForm = ({ onComplete }: Props) => {
  const [fileName, setFileName] = useState('')
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>()

  const addSongMutation = useAddSong()
  const selectedYoutubeUrl = watch('youtube_url')

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      setValue('file', file)
      setFileName(file.name)
      setValue('youtube_url', '') // Clear URL input when a file is selected
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/mpeg': ['.mp3'],
      'audio/wav': ['.wav'],
    },
    maxFiles: 1,
  })

  const onSubmit = (data: FormData) => {
    addSongMutation.mutate(
      {
        file: data.file,
        youtube_url: data.youtube_url,
      },
      {
        onSuccess: () => {
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
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        alignItems: 'center',
      }}
    >
      <Box
        {...getRootProps()}
        sx={{
          p: 3,
          border: '2px dashed gray',
          borderRadius: '50%',
          height: 200,
          width: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          mb: 2,
          bgcolor: isDragActive ? 'rgba(0, 0, 0, 0.05)' : 'background.default',
          cursor: 'pointer',
        }}
      >
        <input {...getInputProps()} />
        <Typography>
          {fileName
            ? `Selected file: ${fileName}`
            : 'Drag and drop an audio file here or click to select'}
        </Typography>
      </Box>
      <Controller
        name="youtube_url"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="YouTube URL"
            variant="outlined"
            placeholder="Paste YouTube URL here"
            onChange={(e) => {
              field.onChange(e.target.value)
              setValue('file', undefined) // Clear file input when a URL is entered
              setFileName('')
            }}
            sx={{ mb: 2, backgroundColor: 'white' }}
          />
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
        disabled={!fileName && !selectedYoutubeUrl}
      >
        Submit Song
      </LoadingButton>
    </Box>
  )
}

export default SongForm
