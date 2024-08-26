import React, { useState } from 'react'
import useMultiTrackPlayer from '@/hooks/useMultiTrackPlayer'
import { Box, Paper } from '@mui/material'
import { useAddTrackBySongId } from '@/hooks/useAddTrackBySongId'
import { useAtomValue } from 'jotai'
import { userAtom } from '@/state/user'
import TransportBar from '../TransportBar'

const MultiTrackPlayer = ({ urls, songId }) => {
  const [selectedDeviceId, setSelectedDeviceId] = useState(null)
  const [trackName, setTrackName] = useState('')
  const [recordingWaveSurfer, setRecordingWaveSurfer] = useState(null)
  const user = useAtomValue(userAtom)
  const [scrollingWaveform, setScrollingWaveform] = useState(false)
  const [isRecording, setIsRecording] = useState(false)

  const {
    containerRef,
    isPlaying,
    playPause,
    skipForward,
    skipBackward,
    backToStart,
    muteTrack,
    unmuteTrack,
    isTrackMuted,
    trackMetadata,
    startRecording,
    stopRecording,
    getCurrentTime,
    addBlankTrack,
    setTrackMetadata,
  } = useMultiTrackPlayer(urls)

  const addTrackMutation = useAddTrackBySongId()

  return (
    <Box
      sx={{
        width: 1,
        display: 'flex',
        gap: 2,
        flexDirection: 'column',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TransportBar
          isPlaying={isPlaying}
          playPause={playPause}
          backToStart={backToStart}
          skipBackward={skipBackward}
          skipForward={skipForward}
        />
      </Box>
      <Box sx={{ display: 'flex', height: 1, width: 1, gap: 1 }}>
        <Box>
          {trackMetadata.map((track) => (
            <Paper
              elevation={3}
              key={track.id}
              sx={{
                display: 'flex',
                gap: 1,
                justifyContent: 'space-between',
                p: 1,
                mb: '2px',
                height: '150px',
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  zIndex: 2,
                  top: 0,
                  left: 50,
                  backgroundColor: '#444444aa',
                  p: 0.5,
                }}
              >
                {track.name}
              </Box>
              <Box
                onClick={() =>
                  isTrackMuted(track.id)
                    ? unmuteTrack(track.id)
                    : muteTrack(track.id)
                }
                sx={{
                  bgcolor: isTrackMuted(track.id) ? 'error.main' : 'grey.400',
                  color: isTrackMuted(track.id) ? 'white' : 'black',
                  width: 20,
                  height: 20,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                M
              </Box>
            </Paper>
          ))}
        </Box>

        <Box
          ref={containerRef}
          sx={{
            background: '#2d2d2d',
            color: '#fff',
            width: 1,
            height: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        />
      </Box>
    </Box>
  )
}

export default MultiTrackPlayer
