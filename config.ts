export default {
  baseApiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  supabaseUrl:
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xyzcompany.supabase.co',
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_KEY || 'public-anon-key',
  godMode: process.env.NEXT_PUBLIC_GODMODE === 'true',
}
