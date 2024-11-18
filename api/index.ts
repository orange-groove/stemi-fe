import config from '@/config'
import supabase from '@/lib/supabase'
import axios from 'axios'

const apiClient = axios.create({
  baseURL: config.baseApiUrl,
  timeout: 10000,
})

apiClient.interceptors.request.use(
  async (config) => {
    const session = await supabase.auth.getSession()
    const accessToken = session.data.session?.access_token

    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

export default apiClient
