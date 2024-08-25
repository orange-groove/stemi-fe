import React, { useState } from 'react'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import VolumeOffIcon from '@mui/icons-material/VolumeOff'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import useMultiTrackPlayer from '@/hooks/useMultiTrackPlayer'
import { Box, Button, Input } from '@mui/material'
import AudioInputSelector from '../AudioInputSelector'
import { useAudioRecorder } from '@/hooks/useAudioRecorder'
import { useAddTrackBySongId } from '@/hooks/useAddTrackBySongId'
import { useAtom, useAtomValue } from 'jotai'
import { userAtom } from '@/state/user'

const MultiTrackPlayer = ({
  urls,
  songId,
}: {
  urls: string[]
  songId: string
}) => {
  const { isRecording, startRecording, stopRecording } = useAudioRecorder()
  const [selectedDeviceId, setSelectedDeviceId] = useState(null)
  const [trackName, setTrackName] = useState('')
  const user = useAtomValue(userAtom)

  const {
    containerRef,
    isPlaying,
    playPause,
    muteTrack,
    unmuteTrack,
    isTrackMuted,
    addTrack,
    trackMetadata,
  } = useMultiTrackPlayer(urls)

  const addTrackMutation = useAddTrackBySongId()

  const handleDeviceSelect = (deviceId) => {
    setSelectedDeviceId(deviceId)
  }

  const handleStartRecording = () => {
    startRecording(selectedDeviceId)
  }

  const handleStopRecording = async () => {
    const audioBlob = await stopRecording()
    const file = new File([audioBlob], `${trackName}.mp3`, {
      type: 'audio/mp3',
    })

    addTrackMutation.mutate({
      userId: user?.id,
      songId,
      trackName,
      file,
    })
  }

  const addNewTrack = async () => {
    if (selectedDeviceId) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            deviceId: selectedDeviceId
              ? { exact: selectedDeviceId }
              : undefined,
          },
        })

        const audioContext = new AudioContext()
        const source = audioContext.createMediaStreamSource(stream)
        const destination = audioContext.createMediaStreamDestination()
        source.connect(destination)

        // Convert the MediaStream to a blob to add as a new track
        const recordedChunks = []
        const mediaRecorder = new MediaRecorder(destination.stream)

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunks.push(event.data)
          }
        }

        mediaRecorder.onstop = () => {
          const blob = new Blob(recordedChunks, { type: 'audio/wav' })
          const url = URL.createObjectURL(blob)
          addTrack(url)
        }

        mediaRecorder.start()

        // Stop recording after a fixed duration (e.g., 5 seconds)
        setTimeout(() => {
          mediaRecorder.stop()
        }, 5000)
      } catch (error) {
        console.error('Error accessing audio device:', error)
      }
    }
  }

  return (
    <Box sx={{ height: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: '85px' }}>
        <Button onClick={playPause}>
          {isPlaying ? (
            <PauseIcon color="warning" sx={{ fontSize: 60 }} />
          ) : (
            <PlayArrowIcon color="success" sx={{ fontSize: 60 }} />
          )}
        </Button>

        <Button onClick={addNewTrack}>Add new track</Button>
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
                <Button
                  onClick={() => unmuteTrack(track.id)}
                  variant="contained"
                  sx={{ bgcolor: 'gray.400' }}
                >
                  Mute
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
