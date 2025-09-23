import { useEffect, useState } from 'react'
import { useAtomValue } from 'jotai'
import supabase from '@/lib/supabase'
import { userAtom } from '@/state/user'

export type Entitlement = {
  user_id: string
  active: boolean
  // add other fields if present in your schema
}

export function useEntitlement() {
  const user = useAtomValue(userAtom)
  const [loading, setLoading] = useState(false)
  const [entitlement, setEntitlement] = useState<Entitlement | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!user) {
        setEntitlement(null)
        return
      }
      setLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from('entitlements')
        .select('user_id, active, status, current_period_end')
        .eq('user_id', user.id)
        .maybeSingle()
      if (cancelled) return
      if (error) {
        setError(error.message)
        setEntitlement(null)
      } else {
        // Check if subscription is active and not expired
        const isActive =
          data?.active &&
          (data?.status === 'active' || data?.status === 'trialing') &&
          (!data?.current_period_end ||
            new Date(data.current_period_end) > new Date())

        setEntitlement({
          ...data,
          active: !!isActive,
        } as Entitlement | null)
      }
      setLoading(false)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [user?.id])

  return { user, entitlement, loading, error }
}
