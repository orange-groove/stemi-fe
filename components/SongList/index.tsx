import React from 'react'
import { List, ListItem, ListItemText } from '@mui/material'
import SongComponent from '@/components/Song'
import { Song } from '@/types'

interface SongListProps {
  songs: Song[]
}

export default function SongList({ songs }: SongListProps) {
  return (
    <List>
      {songs.map((song) => (
        <ListItem key={song.id}>
          <SongComponent data={song} />
        </ListItem>
      ))}
    </List>
  )
}
