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
				if (session?.user) {
					// If already on /stems, do not redirect (preserves query like sessionId)
					if (!window.location.pathname.startsWith('/stems')) {
						router.replace('/stems')
					}
				}
			} else if (event === 'SIGNED_IN') {
				setUser(session?.user ?? null)
				// send user to the stems flow after auth, but preserve query on /stems
				if (!window.location.pathname.startsWith('/stems')) {
					router.replace('/stems')
				}
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
		if (!entitlement?.active) {
			if (!window.location.pathname.startsWith('/subscribe')) {
				router.replace('/subscribe')
			}
		}
	}, [ready, user, entitlement?.active, loading, router])

	if (!ready) return null
	return <>{children}</>
}

export default AuthGuard
