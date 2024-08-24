'use client'

import React from 'react'
import {
  Box,
  Unstable_Grid2 as Grid,
  List,
  ListItem,
  Typography,
} from '@mui/material'
import SongComponent from '@/components/Song'
import useSongsByUserId from '@/hooks/useSongsByUserId'
import { Song } from '@/types'
import { AddBox } from '@mui/icons-material'

const SongList = () => {
  const { songs, loading, error } = useSongsByUserId()

  if (loading) return <div>Loading...</div>

  if (error) return <div>Error: {error}</div>

  return (
    <>
      <Box sx={{ my: 6 }}>
        <Typography variant="h3">Songs</Typography>
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

export default SongList
