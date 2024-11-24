'use client'

import { Box, Paper } from '@mui/material'
import MultiTrackPlayer from '../MultitrackPlayerV2'
import useSongById from '@/hooks/useGetSong'
import { useParams } from 'next/navigation'
import useSongFromGenius from '@/hooks/useSongFromGenius'
import useUpdateSong from '@/hooks/useUpdateSong'
import EditableInput from '../EditableInput'

export default function SongDetail() {
  const params = useParams()

  const { data: song, isLoading, error } = useSongById(params.songId as string)
  const { data: geniusSongData, isFetching } = useSongFromGenius(
    song?.title,
    song?.artist,
  )

  const { mutate: updateSong, isPending: isUpdateSongPending } = useUpdateSong()

  const handleLyricsClick = () => {
    window.open(
      geniusSongData?.result?.url,
      'winname',
      'directories=0,titlebar=0,toolbar=0,location=0,status=0,menubar=0,scrollbars=no,resizable=no,width=400,height=350',
    )
  }

  const handleArtistUpdate = (newArtist: string) => {
    if (newArtist !== song?.artist) {
      updateSong({
        song: {
          id: song?.id,
          artist: newArtist,
        },
      })
    }
  }

  const handleTitleUpdate = (newTitle: string) => {
    if (newTitle !== song?.title) {
      updateSong({
        song: {
          id: song?.id,
          title: newTitle,
        },
      })
    }
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
            backgroundImage: `url(${song?.image_url})`,
            width: '200px',
            height: '200px',
            backgroundSize: 'contain',
            flexShrink: 0,
          }}
        />
        <Box
          sx={{ display: 'flex', flexDirection: 'column', p: 2, flexShrink: 0 }}
        >
          <EditableInput
            value={song?.artist || ''}
            placeholder="Artist Name"
            onComplete={handleArtistUpdate}
            disabled={isUpdateSongPending}
            sx={{ mb: 1, fontSize: '1.5rem', fontWeight: 600 }}
          />
          <EditableInput
            value={song?.title || ''}
            placeholder="Song Title"
            onComplete={handleTitleUpdate}
            disabled={isUpdateSongPending}
            sx={{ mb: 2, fontSize: '1.25rem', fontWeight: 500 }}
          />
        </Box>
      </Box>

      {song && <MultiTrackPlayer tracks={song.tracks} />}
      {/* <InfoPopup popups={infoData?.popups} /> */}
    </Box>
  )
}
