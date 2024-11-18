import config from '@/config'
import { client as apiClient } from '../api/client/services.gen'
import supabase from './supabase'
import { pushSnackbarAtom } from '@/state/snackbar'
import { getDefaultStore } from 'jotai'

const store = getDefaultStore()

apiClient.setConfig({
  baseURL: config.baseApiUrl,
})

apiClient.instance.interceptors.request.use(async (config) => {
  const session = await supabase.auth.getSession()
  const accessToken = session.data.session?.access_token

  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`
  }
  return config
})

// Request Interceptor
apiClient.instance.interceptors.request.use(
  (config) => {
    // You can add custom headers here if needed
    // Example: config.headers['Authorization'] = 'Bearer your-token';
    return config
  },
  (error) => {
    store.set(pushSnackbarAtom, {
      message: 'Request failed to initialize.',
      type: 'error',
    })
    return Promise.reject(error)
  },
)

// Response Interceptor
apiClient.instance.interceptors.response.use(
  (response) => {
    // Set a success message for specific responses if desired
    store.set(pushSnackbarAtom, {
      message: response.data.message,
      type: 'success',
    })
    return response
  },
  (error) => {
    // Extract error details
    const errorMessage =
      error.response?.data?.message || error.message || 'An error occurred.'

    // Set a global error message
    store.set(pushSnackbarAtom, {
      message: `Error: ${errorMessage}`,
      type: 'error',
    })

    return Promise.reject(error)
  },
)
