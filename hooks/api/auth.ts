'use client'

import config from '@/config'
import { useMutation } from '@tanstack/react-query'

export function useRegister() {
  return useMutation({
    mutationFn: async (formData: any) => {
      const res = await fetch(`${config.baseApiUrl}/auth/register`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      return await res.json()
    },
  })
}

export function useLogin() {
  return useMutation({
    mutationFn: async (formData: any) => {
      const res = await fetch(`${config.baseApiUrl}/auth/login`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      return await res.json()
    },
  })
}
