import React, { useEffect, useRef } from 'react'
import { Box, Slider, Typography } from '@mui/material'
import { useWavesurfer } from '@wavesurfer/react'

interface Track {
  name: string
  url: string
}

interface TrackComponentProps {
  track: Track
  onSeek: (time: number) => void
  registerInstance: (ws: any) => void
  volume: number
  masterVolume: number
  onVolumeChange: (volume: number) => void
}

const TrackComponent = ({
  track,
  onSeek,
  registerInstance,
  volume,
  masterVolume,
  onVolumeChange,
}: TrackComponentProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { wavesurfer, isReady } = useWavesurfer({
    container: containerRef,
    url: track.url,
    waveColor: '#ccc',
    progressColor: '#007bff',
    cursorColor: '#FFAA00',
    height: 80,
    normalize: true,
    backend: 'WebAudio',
  })

  useEffect(() => {
    if (isReady && wavesurfer) {
      registerInstance(wavesurfer)
      wavesurfer.setVolume(volume * masterVolume) // Adjust volume relative to master
    }
  }, [isReady, wavesurfer, volume, masterVolume])

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: 100 }}>
        <Typography variant="body2" sx={{ height: '20px' }}>
          {track.name}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ flexGrow: 1 }} />
          <Slider
            value={volume}
            onChange={(e, value) => onVolumeChange(value as number)}
            min={0}
            max={1}
            step={0.01}
            orientation="vertical"
            sx={{ height: '50px' }}
          />
        </Box>
      </Box>

      {/* Waveform */}
      <Box
        ref={containerRef}
        sx={{
          width: '100%',
          height: '80px',
          border: '1px solid #ccc',
          cursor: 'pointer',
        }}
        onClick={(e) => {
          if (wavesurfer) {
            const rect = e.currentTarget.getBoundingClientRect()
            const clickX = e.clientX - rect.left
            const position = (clickX / rect.width) * wavesurfer.getDuration()
            onSeek(position)
          }
        }}
      />
    </Box>
  )
}

export default TrackComponent
