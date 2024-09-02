'use client'

import config from '@/config'
import supabase from '@/lib/supabase'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

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

export function useUser() {
  const [user, setUser] = useState<any>(null)
  useEffect(() => {
    ;(async () => {
      const u = await supabase.auth.getUser()
      setUser(u.data.user)
    })()
  }, [])
  return user
}
