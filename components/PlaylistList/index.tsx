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
import Playlist from '@/components/Playlist'
import { Playlist as PlaylistType, Song } from '@/types'
import useGetPlaylists from '@/hooks/useGetPlaylists'
import NewPlaylistModal from '../NewPlaylistModal'

const PlaylistList = () => {
  const { data: playlists, isLoading, error } = useGetPlaylists()
  const [sortedPlaylists, setSortedPlaylists] = useState<Song[]>([])
  const [sort, setSort] = useState('date-desc')

  useEffect(() => {
    if (playlists) {
      sortSongs(sort)
    }
  }, [playlists])

  const sortSongs = (sort: string) => {
    if (sort === 'date-asc') {
      setSortedPlaylists(
        // @ts-ignore
        playlists?.toSorted(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        ),
      )
    } else if (sort === 'date-desc') {
      setSortedPlaylists(
        // @ts-ignore
        playlists?.toSorted(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        ),
      )
    } else if (sort === 'name') {
      // @ts-ignore
      setSortedPlaylists(
        playlists?.toSorted((a, b) => a.name.localeCompare(b.name)),
      )
    }
  }

  if (isLoading) return <div>Loading...</div>

  if (error) return <div>Error: {error.message}</div>

  return (
    <>
      <Box sx={{ m: 4, display: 'flex', gap: 4 }}>
        <Typography variant="h4">My Playlists</Typography>

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
        <NewPlaylistModal />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          width: '66%',
          margin: '0 auto',
        }}
      >
        {sortedPlaylists?.map((playlist: PlaylistType) => (
          <Box key={playlist?.id}>
            <Playlist playlist={playlist} />
          </Box>
        ))}
      </Box>
    </>
  )
}

export default PlaylistList
