import React, { useEffect, useRef } from 'react'
import { Box, Button, Slider, Typography } from '@mui/material'
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
  isMuted: boolean
  isSoloed: boolean
  onMute: () => void
  onSolo: () => void
}

const TrackComponent = ({
  track,
  onSeek,
  registerInstance,
  volume,
  masterVolume,
  onVolumeChange,
  isMuted,
  isSoloed,
  onMute,
  onSolo,
}: TrackComponentProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { wavesurfer, isReady } = useWavesurfer({
    container: containerRef,
    url: track.url,
    waveColor: '#ccc',
    progressColor: '#007bff',
    cursorColor: '#FFAA00',
    height: 100,
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
    <Box
      sx={{
        display: 'flex',
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', width: 120, p: 1 }}>
        <Typography variant="body2" sx={{ height: '20px' }}>
          {track.name}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            onClick={onMute}
            sx={{
              bgcolor: isMuted ? 'red' : 'grey',
              '&:hover': { bgcolor: isMuted ? 'darkred' : 'darkgrey' },
              width: '30px',
              height: '30px',
              minWidth: '30px',
            }}
          >
            M
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={onSolo}
            sx={{
              bgcolor: isSoloed ? 'yellow' : 'grey',
              '&:hover': { bgcolor: isSoloed ? 'gold' : 'darkgrey' },
              width: '30px',
              height: '30px',
              minWidth: '30px',
            }}
          >
            S
          </Button>
          <Slider
            value={volume}
            onChange={(e, value) => onVolumeChange(value as number)}
            min={0}
            max={1}
            step={0.01}
            orientation="vertical"
            size="small"
            sx={{
              height: '50px',
              '& .MuiSlider-thumb': {
                height: 16,
                width: 14,
                backgroundColor: '#fff',
                border: '2px solid currentColor',
                '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                  boxShadow: 'inherit',
                },
                '&::before': {
                  display: 'none',
                },
                borderRadius: 0,
              },
            }}
          />
        </Box>
      </Box>

      {/* Waveform */}
      <Box
        ref={containerRef}
        sx={{
          width: '100%',
          height: '100px',
          borderLeft: '1px solid #ccc',
          bgcolor: 'background.paper',
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
