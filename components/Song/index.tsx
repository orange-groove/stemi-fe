'use client'

import type { Song, Track } from '@/types'
import { Box, Button, List, ListItem, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'

export default function Song({
  song,
  onClick,
}: {
  song: Song
  onClick: () => void
}) {
  const router = useRouter()

  return (
    <Box
      sx={{ background: 'white', borderRadius: 2, width: 400, p: 2 }}
      onClick={onClick}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h4">{song.name}</Typography>
          <Typography variant="h5">{song.description}</Typography>
        </Box>
        <Button onClick={() => router.push(`/songs/${song.id}`)}>Mix</Button>
      </Box>
      <List disablePadding>
        {song?.tracks?.map((track: Track) => (
          <ListItem key={track.url}>
            <audio controls>
              <source src={track.url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
