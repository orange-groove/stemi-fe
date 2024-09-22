'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import SongComponent from '@/components/Song'
import useSongsByUserId from '@/hooks/useSongsByUserId'
import { Song } from '@/types'
import NewSongModal from '../NewSongModal'

const SongList = () => {
  const { songs, loading, error } = useSongsByUserId()
  const [sortedSongs, setSortedSongs] = useState<Song[]>([])
  const [sort, setSort] = useState('date-desc')

  useEffect(() => {
    if (songs) {
      sortSongs(sort)
    }
  }, [songs])

  const sortSongs = (sort: string) => {
    if (sort === 'date-asc') {
      setSortedSongs(
        songs.toSorted(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        ),
      )
    } else if (sort === 'date-desc') {
      setSortedSongs(
        songs.toSorted(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        ),
      )
    } else if (sort === 'name') {
      setSortedSongs(songs.toSorted((a, b) => a.name.localeCompare(b.name)))
    }
  }

  if (loading) return <div>Loading...</div>

  if (error) return <div>Error: {error}</div>

  return (
    <>
      <Box sx={{ m: 4, display: 'flex', gap: 4 }}>
        <Typography variant="h4">My Library</Typography>

        <FormControl>
          <InputLabel id="sort-label">Sort By</InputLabel>
          <Select
            labelId="sort-label"
            id="sort-select"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value as string)
              sortSongs(e.target.value as string)
            }}
          >
            <MenuItem value="date-asc">Date (asc)</MenuItem>
            <MenuItem value="date-desc">Date (desc)</MenuItem>
            <MenuItem value="name">Name</MenuItem>
          </Select>
        </FormControl>
        <NewSongModal />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          width: '66%',
          margin: 'auto',
        }}
      >
        {sortedSongs.map((song: Song) => (
          <Box key={song?.id}>
            <SongComponent song={song} />
          </Box>
        ))}
      </Box>
    </>
  )
}

export default SongList
