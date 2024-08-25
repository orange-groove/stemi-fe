'use client'

import React from 'react'
import { Box, Grid, Typography } from '@mui/material'
import SongComponent from '@/components/Song'
import useSongsByUserId from '@/hooks/useSongsByUserId'
import { Song } from '@/types'
import NewSongModal from '../NewSongModal'
import { useRouter } from 'next/navigation'
import Masonry from '@mui/lab/Masonry'

const Multitrack = () => {
  const router = useRouter()

  const { songs, loading, error } = useSongsByUserId()

  if (loading) return <div>Loading...</div>

  if (error) return <div>Error: {error}</div>

  return (
    <>
      <Box sx={{ my: 6, display: 'flex', gap: 4 }}>
        <Typography variant="h3">Songs</Typography>
        <NewSongModal />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {songs.map((song: Song) => (
          <Box
            key={song?.id}
            sx={{ border: '1px dotted', borderColor: 'secondary.main', m: 2 }}
          >
            <SongComponent song={song} />
          </Box>
        ))}
      </Box>
    </>
  )
}

export default Multitrack
