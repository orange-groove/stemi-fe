'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAtomValue } from 'jotai'
import { userAtom } from '@/state/user'
import { client as apiClient } from '@/api/client/services.gen'

export interface UsageInfo {
  current_usage: number
  monthly_limit: number
  can_process: boolean
  is_premium: boolean
  reset_date?: string
}

export const useUsage = () => {
  const [usage, setUsage] = useState<UsageInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const user = useAtomValue(userAtom)

  console.log('useUsage hook - User:', user?.id, 'Loading:', loading)

  const checkUsage = useCallback(async () => {
    console.log('checkUsage called - User:', user?.id)
    if (!user) {
      console.log('No user, setting usage to null')
      setUsage(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      console.log('Fetching usage for user:', user.id)

      const response = await apiClient.instance.get('/usage')
      const usageData = response.data as UsageInfo
      console.log('Usage data received:', usageData)
      setUsage(usageData)
    } catch (err: any) {
      console.error('Failed to fetch usage:', err)

      // If API endpoint doesn't exist yet or network error, block access (show paywall)
      if (
        err.response?.status === 404 ||
        err.code === 'ENOTFOUND' ||
        err.code === 'ERR_NETWORK' ||
        err.message === 'Network Error'
      ) {
        console.log('Usage API not available, blocking access for security')
        setUsage({
          current_usage: 0,
          monthly_limit: 3,
          can_process: false, // Block access when API is down
          is_premium: false,
        })
      } else {
        setError(
          err.response?.data?.message || 'Failed to fetch usage information',
        )
      }
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    console.log('useUsage - User changed:', user?.id)
    if (user) {
      checkUsage()
    } else {
      setUsage(null)
      setLoading(false)
    }
  }, [user, checkUsage])

  return {
    usage,
    loading,
    error,
    refetch: checkUsage,
  }
}
