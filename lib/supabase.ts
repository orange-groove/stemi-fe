import config from '@/config'
import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabase = createClient(config.supabaseUrl, config.supabaseKey)

export default supabase
