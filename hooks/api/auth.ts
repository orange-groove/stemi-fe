'use client'

import { useMutation } from '@tanstack/react-query'

export function useRegister() {
  return useMutation({
    mutationFn: async (formData: any) => {
      const res = await fetch('api/v1/auth/register', {
        method: 'POST',
        body: formData,
      })

      return await res.json()
    },
  })
}

export function useLogin() {
  return useMutation({
    mutationFn: async (formData: any) => {
      const res = await fetch('api/v1/auth/login', {
        method: 'POST',
        body: formData,
      })

      return await res.json()
    },
  })
}
