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
import SongItem from '@/components/SongItem'
import NewSongModal from '../NewSongModal'
import { Song } from '@/api/client'

interface SongsListProps {
  songs?: Song[]
}

const SongList = ({ songs }: SongsListProps) => {
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
            new Date(a.created_at!).getTime() -
            new Date(b.created_at!).getTime(),
        ),
      )
    } else if (sort === 'date-desc') {
      setSortedSongs(
        // @ts-ignore
        songs.toSorted(
          (a, b) =>
            new Date(b.created_at!).getTime() -
            new Date(a.created_at!).getTime(),
        ),
      )
    } else if (sort === 'title') {
      // @ts-ignore
      setSortedSongs(songs.toSorted((a, b) => a.title?.localeCompare(b.title)))
    }
  }

  if (!songs?.length) {
    return (
      <Box sx={{ p: 4, height: '100%' }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Typography variant="h4" sx={{ fontSize: [24, 32] }}>
            My Songs
          </Typography>
          <NewSongModal />
        </Box>

        <Box
          sx={{
            height: '100%',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant="h5">No songs found</Typography>
        </Box>
      </Box>
    )
  }

  return (
    <>
      <Box sx={{ m: 2, display: 'flex', gap: 2 }}>
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
            <MenuItem value="title">Title</MenuItem>
          </Select>
        </FormControl>
        <NewSongModal />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          p: 4,
        }}
      >
        {sortedSongs.map((song: Song) => (
          <Box key={song?.id}>
            <SongItem song={song} />
          </Box>
        ))}
      </Box>
    </>
  )
}

export default SongList
