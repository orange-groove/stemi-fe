'use client'

import { useState } from 'react'
import type { Track } from '@/types'

export default function Song() {
  const [tracks, setTracks] = useState<Track[]>([])

  return <div>test song</div>
}
