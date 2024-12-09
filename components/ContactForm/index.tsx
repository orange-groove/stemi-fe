'use client'

import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Box, TextField, Typography } from '@mui/material'
import LoadingButton from '../LoadingButton'
import useSendMail from '@/hooks/useSendMail'
import { useSetAtom } from 'jotai'
import { snackbarAtom } from '@/state/snackbar'

interface Props {
  onComplete?: () => void
}

export interface ContactFormData {
  name: string
  email: string
  message: string
}

const ContactForm = ({ onComplete }: Props) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm()

  const { mutate: sendMail, isPending } = useSendMail()
  const setSnackbar = useSetAtom(snackbarAtom)

  const onSubmit = (data: ContactFormData) => {
    sendMail(data, {
      onSuccess: () => {
        if (onComplete) {
          onComplete()
        }
        setSnackbar({ open: true, message: 'Message sent!', type: 'success' })
      },
      onError: (error) => {
        console.error('Error:', error)
        setSnackbar({ open: true, message: error.message, type: 'success' })
      },
    })
  }

  return (
    <Box
      component="form"
      // @ts-ignore
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{ mt: 3 }}
    >
      <Box>
        <Typography variant="h4" textAlign="center">
          Contact Us
        </Typography>
      </Box>
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

      <Controller
        name="email"
        control={control}
        defaultValue=""
        rules={{ required: 'Email is required' }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            error={!!errors.name}
          />
        )}
      />

      <Controller
        name="message"
        control={control}
        defaultValue=""
        rules={{ required: 'Title is required' }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Message"
            variant="outlined"
            fullWidth
            margin="normal"
            maxRows={20}
            multiline
            error={!!errors.name}
          />
        )}
      />

      <LoadingButton
        type="submit"
        isLoading={isPending}
        loadingText="Sending..."
        fullWidth
        variant="contained"
        color="primary"
      >
        Send Message
      </LoadingButton>
    </Box>
  )
}

export default ContactForm
