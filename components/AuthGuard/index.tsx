'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '@/lib/supabase'

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      const user = await supabase.auth.getUser()
      if (user.error) {
        router.push('/login')
      }
    })()
  }, [router])

  return <>{children}</>
}

export default AuthGuard
