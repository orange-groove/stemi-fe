'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useEntitlement } from '@/hooks/useEntitlement'

type PaymentGuardProps = {
  children: React.ReactNode
}

export default function PaymentGuard({ children }: PaymentGuardProps) {
  const router = useRouter()
  const { entitlement, loading } = useEntitlement()

  useEffect(() => {
    if (loading) return
    if (!entitlement?.active) {
      router.replace('/subscribe')
    }
  }, [loading, entitlement?.active, router])

  if (loading) return null
  if (!entitlement?.active) return null

  return <>{children}</>
}
