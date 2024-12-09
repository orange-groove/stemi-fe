'use client'

import { useMutation } from '@tanstack/react-query'
import { ContactFormData } from '@/components/ContactForm'
import axios from 'axios'

const mutationFn = async (params: ContactFormData) => {
  const { name, email, message } = params

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_URL}/api/contact`,
    {
      name,
      email,
      message,
    },
  )

  return response.data
}

export default function useSendMail() {
  const mutation = useMutation({
    mutationFn,
  })

  return mutation
}
