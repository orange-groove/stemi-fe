import React, { useState, useEffect, useRef } from 'react'
import useMultiTrackPlayer from '@/hooks/useMultiTrackPlayer'
import { Box, Button, Input } from '@mui/material'
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
    <Box sx={{ height: 1, display: 'flex', gap: 2, flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: '85px' }}>
        <TransportBar
          isPlaying={isPlaying}
          playPause={playPause}
          backToStart={backToStart}
          skipBackward={skipBackward}
          skipForward={skipForward}
        />
      </Box>
      <Box sx={{ display: 'flex' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
          }}
        >
          {trackMetadata.map((track) => (
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
                <Button
                  onClick={() => unmuteTrack(track.id)}
                  variant="contained"
                  sx={{ bgcolor: 'gray.400' }}
                >
                  Unmute
                </Button>
              ) : (
                <Button
                  onClick={() => muteTrack(track.id)}
                  sx={{ bgcolor: 'gray.400' }}
                >
                  Mute
                </Button>
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
        />
      </Box>
      <Box>
        <Input
          type="text"
          placeholder="Track Name"
          value={trackName}
          onChange={(e) => setTrackName(e.target.value)}
        />
        <Button onClick={handleAddTrack}>Add Track</Button>
        <Button onClick={handleStartRecording} disabled={isRecording}>
          Start Recording
        </Button>
        <Button onClick={handleStopRecording} disabled={!isRecording}>
          Stop Recording & Upload
        </Button>
        <AudioInputSelector onDeviceSelect={handleDeviceSelect} />
      </Box>
    </Box>
  )
}

export default MultiTrackPlayer
