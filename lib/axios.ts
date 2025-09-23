import config from '@/config'
import { client as apiClient } from '../api/client/services.gen'
import supabase from './supabase'
import { pushSnackbarAtom } from '@/state/snackbar'
import { getDefaultStore } from 'jotai'

const store = getDefaultStore()

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
      store.set(pushSnackbarAtom, {
        message: 'Request failed to initialize.',
        type: 'error',
      })
      return Promise.reject(error)
    }
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
