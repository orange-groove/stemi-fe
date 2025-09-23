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
    // Extract error details
    const errorMessage =
      error.response?.data?.message || error.message || 'An error occurred.'

    console.error('API Error:', errorMessage)
    return Promise.reject(error)
  },
)
