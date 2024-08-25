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

export default function useSongById(songId: string) {
  const [song, setSong] = useState<Song | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const user = useAtomValue(userAtom)

  useEffect(() => {
    const fetchSong = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('song')
        .select('*')
        .eq('id', songId)
        .single()

      if (error) {
        setError(error.message)
      } else {
        setSong(data)
      }
      setLoading(false)
    }

    !!user?.id && songId && fetchSong()
  }, [user?.id, songId])

  return { song, loading, error }
}
