'use client'

import React, { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import SongComponent from '@/components/Song'
import useSongsByUserId from '@/hooks/useSongsByUserId'
import { Song } from '@/types'
import NewSongModal from '../NewSongModal'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { userSongsAtom } from '@/state/song'

const SongList = () => {
  const { songs, loading, error } = useSongsByUserId()
  const [userSongs, setUserSongs] = useAtom(userSongsAtom)

  useEffect(() => {
    setUserSongs(songs)
  }, [songs])

  if (loading) return <div>Loading...</div>

  if (error) return <div>Error: {error}</div>

  return (
    <>
      <Box sx={{ m: 4, display: 'flex', gap: 4 }}>
        <Typography variant="h4">Songs</Typography>
        <NewSongModal />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {userSongs.map((song: Song) => (
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

export default SongList
