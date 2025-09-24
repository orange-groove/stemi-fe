'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUsage } from '@/hooks/useUsage'

type PaymentGuardProps = {
  children: React.ReactNode
}

export default function PaymentGuard({ children }: PaymentGuardProps) {
  const router = useRouter()
  const { usage, loading } = useUsage()

  console.log('PaymentGuard - Usage:', usage, 'Loading:', loading)

  useEffect(() => {
    if (loading) return
    if (!usage) return

    // If user has hit their usage limit and is not premium, redirect to subscribe
    if (!usage.can_process && !usage.is_premium) {
      console.log('Free user hit usage limit, redirecting to subscribe')
      router.replace('/subscribe')
    }
  }, [loading, usage, router])

  if (loading) return null
  if (!usage) return null

  return <>{children}</>
}
