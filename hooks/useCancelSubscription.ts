'use client'

import { useState } from 'react'
import { client as apiClient } from '@/api/client/services.gen'

export const useCancelSubscription = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cancelSubscription = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiClient.instance.delete('/billing/subscription')

      if (response.status === 200) {
        // Success - subscription cancelled
        return { success: true }
      } else {
        throw new Error('Failed to cancel subscription')
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to cancel subscription'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return {
    cancelSubscription,
    loading,
    error,
    setError,
  }
}
