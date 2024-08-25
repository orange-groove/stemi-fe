'use client'

import React from 'react'
import { Box, Unstable_Grid2 as Grid, Typography } from '@mui/material'
import Song from '@/components/Song'
import useSongsByUserId from '@/hooks/useSongsByUserId'
import { Song } from '@/types'
import { AddBox } from '@mui/icons-material'
import NewSongModal from '../NewSongModal'
import { useRouter } from 'next/navigation'

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
      <Grid container spacing={2} sx={{ width: 1 }}>
        {songs.map((song: Song) => (
          <Grid key={song?.id} disablePadding>
            <SongComponent song={song} />
          </Grid>
        ))}
      </Grid>
    </>
  )
}

export default Multitrack
