'use client'

import type { Song, Track } from '@/types'
import { Box, Button, List, ListItem, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import TrackComponent from '@/components/Track'

export default function Song({ song }: { song: Song }) {
  const router = useRouter()

  return (
    <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, width: 1, p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h4">{song.name}</Typography>
        </Box>
        <Button onClick={() => router.push(`/songs/${song.id}`)}>Mix</Button>
      </Box>
      <List disablePadding>
        {song?.tracks?.map((track: Track) => (
          <ListItem key={track.url}>
            <Typography variant="subtitle1">{track.name}</Typography>
            <TrackComponent track={track} />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
