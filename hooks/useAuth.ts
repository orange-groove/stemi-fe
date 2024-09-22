'use client'

import supabase from '@/lib/supabase'
import { useEffect, useState } from 'react'

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
