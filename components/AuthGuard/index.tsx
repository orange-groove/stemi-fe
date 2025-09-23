'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '@/lib/supabase'
import { useSetAtom, useAtomValue } from 'jotai'
import { userAtom } from '@/state/user'
import { useEntitlement } from '@/hooks/useEntitlement'

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter()
  const setUser = useSetAtom(userAtom)
  const user = useAtomValue(userAtom)
  const [ready, setReady] = useState(false)
  const { entitlement, loading } = useEntitlement()

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION') {
        // ensure navbar reflects session on first load
        setUser(session?.user ?? null)
        // Don't auto-redirect on initial session - let entitlement logic handle it
      } else if (event === 'SIGNED_IN') {
        setUser(session?.user ?? null)
        // Don't auto-redirect on sign in - let entitlement logic handle it
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        router.push('/')
      } else if (event === 'PASSWORD_RECOVERY') {
        // handle password recovery event
      } else if (event === 'TOKEN_REFRESHED') {
        // handle token refreshed event
      } else if (event === 'USER_UPDATED') {
        // handle user updated event
      }
      setReady(true)
    })

    return () => data.subscription.unsubscribe()
  }, [setUser, router])

  useEffect(() => {
    ;(async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user ?? null)
      setReady(true)
    })()
  }, [setUser])

  useEffect(() => {
    if (!ready) return
    // unauthenticated users handled by existing redirects
    if (!user) return
    // Still loading entitlement
    if (loading) return
    // If user is signed in but not active, redirect to subscribe
    // But don't redirect if already on subscribe page or stems page
    if (!entitlement?.active) {
      const currentPath = window.location.pathname
      if (
        !currentPath.startsWith('/subscribe') &&
        !currentPath.startsWith('/stems')
      ) {
        router.replace('/subscribe')
      }
    }
  }, [ready, user, entitlement?.active, loading, router])

  if (!ready) return null
  return <>{children}</>
}

export default AuthGuard
