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
import type { Song } from '@/types'
import NewSongModal from '../NewSongModal'

interface Props {
  songs: Song[]
}

const SongList = ({ songs }: Props) => {
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
        // @ts-ignore
        songs.toSorted(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        ),
      )
    } else if (sort === 'date-desc') {
      setSortedSongs(
        // @ts-ignore
        songs.toSorted(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      )
    } else if (sort === 'name') {
      // @ts-ignore
      setSortedSongs(songs.toSorted((a, b) => a.name.localeCompare(b.name)))
    }
  }

  if (!songs?.length) {
    return (
      <Box sx={{ p: 4 }}>
        <NewSongModal />
        <Typography variant="h5" sx={{ mt: 4 }}>
          No songs found
        </Typography>
      </Box>
    )
  }

  return (
    <>
      <Box sx={{ m: 4, display: 'flex', gap: 4 }}>
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
