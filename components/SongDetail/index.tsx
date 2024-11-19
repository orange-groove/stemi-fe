'use client'

import { Box, Button, Paper, Typography } from '@mui/material'
import MultiTrackPlayer from '../MultitrackPlayerV2'
import useSongById from '@/hooks/useGetSong'
import { useParams } from 'next/navigation'
import useSongFromGenius from '@/hooks/useSongFromGenius'
import useGetSongInfo from '@/hooks/useGetSongInfo'
import { useAtomValue } from 'jotai'
import { userAtom } from '@/state/user'

export default function SongDetail() {
  const params = useParams()
  const user = useAtomValue(userAtom)

  const { data: song, isLoading, error } = useSongById(params.songId as string)
  const { data: geniusSongData, isFetching } = useSongFromGenius(
    song?.title,
    song?.artist,
  )

  const { data: infoData, isFetching: isInfoFetching } = useGetSongInfo(
    user?.id || '',
    song?.title || '',
    song?.artist || '',
  )

  const handleLyricsClick = () => {
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
            backgroundImage: `url(${song?.imageUrl})`,
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
          <Typography variant="h5">{song?.title}</Typography>
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
        <Box>{infoData?.info}</Box>
      </Box>

      {song && <MultiTrackPlayer tracks={song.tracks} />}
      {/* <InfoPopup popups={infoData?.popups} /> */}
    </Box>
  )
}
