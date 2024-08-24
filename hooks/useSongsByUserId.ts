'use client'

import { useState, useEffect } from 'react'
import supabase from '@/lib/supabase'
import { useAtomValue } from 'jotai'
import { userAtom } from '@/state/user'

interface Song {
  id: string
  name: string
  description: string
  created_at: string
  user_id: string
}

export default function useSongsByUserId() {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const user = useAtomValue(userAtom)

  console.log('user', user)

  useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('song')
        .select('*')
        .eq('user_id', user?.id)

      if (error) {
        setError(error.message)
      } else {
        setSongs(data)
      }
      setLoading(false)
    }

    !!user?.id && fetchSongs()
  }, [user?.id])

  return { songs, loading, error }
}
