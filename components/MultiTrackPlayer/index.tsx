import React, { useState, useEffect, useRef } from 'react'
import useMultiTrackPlayer from '@/hooks/useMultiTrackPlayer'
import { Box, Button, Input, Paper } from '@mui/material'
import AudioInputSelector from '../AudioInputSelector'
import WaveSurfer from 'wavesurfer.js'
import { useAddTrackBySongId } from '@/hooks/useAddTrackBySongId'
import { useAtomValue } from 'jotai'
import { userAtom } from '@/state/user'
import TransportBar from './components/TransportBar'

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

  const handleDeviceSelect = (deviceId) => {
    setSelectedDeviceId(deviceId)
  }

  const handleAddTrack = () => {
    const currentTime = getCurrentTime()
    addBlankTrack(trackName, currentTime)
  }

  const handleStartRecording = () => {
    startRecording(selectedDeviceId)
    setIsRecording(true)
  }

  const handleStopRecording = () => {
    stopRecording((blob) => {
      const recordedUrl = URL.createObjectURL(blob)

      const offset = getCurrentTime() // Use the cursor position as the offset

      const lastTrack = trackMetadata[trackMetadata.length - 1]
      if (lastTrack) {
        // Replace the blank track with the recorded audio
        lastTrack.url = recordedUrl
        lastTrack.startPosition = offset
        // Update trackMetadata state
        setTrackMetadata([...trackMetadata])

        // Upload the file and include metadata with the offset
        const file = new File([blob], `${trackName}.mp3`, {
          type: 'audio/mp3',
        })

        addTrackMutation.mutate({
          userId: user?.id,
          songId,
          trackName,
          file,
          offset,
        })
      }

      setIsRecording(false)
    })
  }

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
                alignItems: 'center',
                p: 2,
                mb: '2px',
                height: '150px',
              }}
            >
              {track.name}
              {isTrackMuted(track.id) ? (
                <Box
                  onClick={() => unmuteTrack(track.id)}
                  sx={{ backgroundColor: 'red.500', border: '1px solid' }}
                >
                  M
                </Box>
              ) : (
                <Box
                  onClick={() => muteTrack(track.id)}
                  sx={{ bgcolor: 'grey.400' }}
                >
                  M
                </Box>
              )}
            </Paper>
          ))}
        </Box>

        <Box
          ref={containerRef}
          sx={{
            background: '#2d2d2d',
            color: '#fff',
            width: 'calc(100% - 100px)',
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
