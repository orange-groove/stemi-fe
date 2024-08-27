'use client'

import { useState, useEffect } from 'react'
import supabase from '@/lib/supabase'
import { useAtomValue } from 'jotai'
import { userAtom } from '@/state/user'
import { Song as SongType, TempoChanges } from '@/types'
import keyBy from 'lodash/keyBy'

interface Song {
  id: string
  name: string
  description: string
  created_at: string
  user_id: string
}

export default function useSongById(songId: string) {
  const [song, setSong] = useState<SongType | null>(null)
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
        const numBeats = data.key_changes[data.key_changes.length - 1].beat
        let previousKey = ''
        const processedKeyChanges = Array(numBeats)
          .fill(null)
          .map((keyChange, i) => {
            const key = data.key_changes.find((kc) => kc.beat === i)
            if (key) {
              previousKey = key.key
              return key.key
            }
            return previousKey
          })

        setSong({
          description: data.description,
          id: data.id,
          name: data.name,
          tracks: data.tracks || [],
          userId: data.user_id,
          keyChanges: processedKeyChanges,
          tempoChanges: keyBy<TempoChanges>(data.tempo_changes, 'beat') || [],
        })
      }
      setLoading(false)
    }

    !!user?.id && songId && fetchSong()
  }, [user?.id, songId])

  return { song, loading, error }
}
