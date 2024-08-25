'use client'

import type { Song, Track } from '@/types'
import { Box, List, ListItem, Typography } from '@mui/material'

export default function Song({
  song,
  onClick,
}: {
  song: Song
  onClick: () => void
}) {
  return (
    <Box
      sx={{ background: 'white', borderRadius: 2, width: 400, p: 2 }}
      onClick={onClick}
    >
      <Typography variant="h4">{song.name}</Typography>
      <Typography variant="h5">{song.description}</Typography>
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
