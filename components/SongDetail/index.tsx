'use client'

import { Box, Button, Paper, Typography } from '@mui/material'
import MultiTrackPlayer from '../MultiTrackPlayer'
import useSongById from '@/hooks/useGetSong'
import { useParams } from 'next/navigation'
import useSongFromGenius from '@/hooks/useSongFromGenius'
import useGetSongInfo from '@/hooks/useGetSongInfo'
import { useAtomValue } from 'jotai'
import { userAtom } from '@/state/user'

export default function SongDetail() {
  const params = useParams()
  const user = useAtomValue(userAtom)

  const { song, loading, error } = useSongById(params.songId as string)
  const { data: geniusSongData, isFetching } = useSongFromGenius(
    song?.name,
    song?.artist,
  )

  const { data: infoData, isFetching: isInfoFetching } = useGetSongInfo(
    user?.id || '',
    song?.name || '',
    song?.artist || '',
  )

  console.log('genius song', geniusSongData)

  const handleLyricsClick = () => {
    // geniusSongData?.result?.url
    window.open(
      geniusSongData?.result?.url,
      'winname',
      'directories=0,titlebar=0,toolbar=0,location=0,status=0,menubar=0,scrollbars=no,resizable=no,width=400,height=350',
    )
  }

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 2,
        width: 1,
        height: 1,
        p: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          p: 2,
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Paper
          sx={{
            backgroundImage: `url(${geniusSongData?.result?.header_image_url})`,
            width: '200px',
            height: '200px',
            backgroundSize: 'contain',
            flexShrink: 0,
          }}
        />
        <Box
          sx={{ display: 'flex', flexDirection: 'column', p: 2, flexShrink: 0 }}
        >
          <Typography variant="h4">{song?.artist}</Typography>
          <Typography variant="h5">{song?.name}</Typography>
          <Button onClick={handleLyricsClick} variant="outlined" sx={{ mt: 1 }}>
            See Lyrics
          </Button>
          <Button
            onClick={handleLyricsClick}
            variant="outlined"
            sx={{ mt: 1 }}
            disabled
          >
            See Tab (coming soon)
          </Button>
        </Box>
        <Box>{infoData}</Box>
      </Box>

      {song && <MultiTrackPlayer song={song} />}
    </Box>
  )
}
