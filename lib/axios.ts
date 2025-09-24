import config from '@/config'
import { client as apiClient } from '../api/client/services.gen'
import supabase from './supabase'

// Set baseURL on the instance directly
apiClient.instance.defaults.baseURL = config.baseApiUrl

// Also try setting it via setConfig
apiClient.setConfig({
  baseURL: config.baseApiUrl,
})

// Request Interceptor - handles auth and errors
apiClient.instance.interceptors.request.use(
  async (config) => {
    try {
      // Add authorization header
      const session = await supabase.auth.getSession()
      const accessToken = session.data.session?.access_token

      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`
      }

      return config
    } catch (error) {
      console.error('Request failed to initialize:', error)
      return Promise.reject(error)
    }
  },
  (error) => {
    console.error('Request failed to initialize:', error)
    return Promise.reject(error)
  },
)

// Response Interceptor
apiClient.instance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle 429 - Usage limit exceeded
    if (error.response?.status === 429) {
      const errorData = error.response.data
      const usageError = new Error(errorData.message || 'Usage limit exceeded')
      // Add usage info to error for handling in components
      ;(usageError as any).isUsageLimit = true
      ;(usageError as any).isPremium = errorData.is_premium
      ;(usageError as any).currentUsage = errorData.current_usage
      ;(usageError as any).monthlyLimit = errorData.monthly_limit
      return Promise.reject(usageError)
    }

    // Handle 401 - Unauthorized
    if (error.response?.status === 401) {
      supabase.auth.signOut()
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }

    // Extract error details for other errors
    const errorMessage =
      error.response?.data?.message || error.message || 'An error occurred.'

    console.error('API Error:', errorMessage)
    return Promise.reject(error)
  },
)
