import React, { useEffect, useState } from 'react'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import VolumeOffIcon from '@mui/icons-material/VolumeOff'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import useMultiTrackPlayer from '@/hooks/useMultiTrackPlayer'
import { Box } from '@mui/material'

const MultiTrackPlayer = ({ urls }: { urls: string[] }) => {
  const {
    containerRef,
    isPlaying,
    playPause,
    muteTrack,
    unmuteTrack,
    isTrackMuted,
    trackMetadata,
  } = useMultiTrackPlayer(urls)

  return (
    <Box sx={{ height: 1 }}>
      <Box>
        <button onClick={playPause}>
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </button>
      </Box>
      <Box
        sx={{
          display: 'flex',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
          }}
        >
          {trackMetadata.map((track, index) => (
            <Box
              key={track.id}
              sx={{
                display: 'flex',
                gap: 1,
                justifyContent: 'space-between',
                p: 2,
              }}
            >
              {track.name}
              {isTrackMuted(track.id) ? (
                <VolumeOffIcon onClick={() => unmuteTrack(track.id)} />
              ) : (
                <VolumeUpIcon onClick={() => muteTrack(track.id)} />
              )}
            </Box>
          ))}
        </Box>
        <Box
          ref={containerRef}
          sx={{
            background: '#2d2d2d',
            color: '#fff',
            width: 'calc(100% - 300px)',
          }}
        ></Box>
      </Box>
    </Box>
  )
}

export default MultiTrackPlayer
