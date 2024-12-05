import React, { useEffect, useMemo, useRef } from 'react'
import {
  Box,
  Button,
  Slider,
  Typography,
  useTheme,
  Skeleton,
} from '@mui/material'
import { useWavesurfer } from '@wavesurfer/react'
import { Track } from '@/api/client'
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js'

const colors = ['purple', 'blue', 'green', 'orange', 'red']

interface TrackComponentProps {
  index: number
  track: Track
  zoomLevel: number
  playbackRate: number
  onClick: (relativeX: number) => void
  registerInstance: (ws: any) => void
  volume: number
  masterVolume: number
  onVolumeChange: (volume: number) => void
  isMuted: boolean
  isSoloed: boolean
  onMute: () => void
  onSolo: () => void
  onScroll: (start: number, end: number, left: number, right: number) => void
}

const TrackComponent = ({
  index,
  track,
  zoomLevel,
  playbackRate,
  onClick,
  registerInstance,
  volume,
  masterVolume,
  onVolumeChange,
  isMuted,
  isSoloed,
  onMute,
  onSolo,
  onScroll,
}: TrackComponentProps) => {
  const theme = useTheme()

  const containerRef = useRef<HTMLDivElement>(null)

  const topTimeline = TimelinePlugin.create({
    height: 20,
    insertPosition: 'beforebegin',
    timeInterval: 0.2,
    primaryLabelInterval: 5,
    secondaryLabelInterval: 1,
    style: {
      color: '#2D5B88',
    },
  })

  const { wavesurfer, isReady } = useWavesurfer({
    container: containerRef,
    url: track.url,
    waveColor: colors[index % colors.length],
    progressColor: colors[index % colors.length],
    cursorColor: '#FFAA00',
    height: 100,
    backend: 'WebAudio',
    hideScrollbar: true,
    autoCenter: false,
    plugins: useMemo(() => (index === 0 ? [topTimeline] : []), []),
  })

  useEffect(() => {
    if (isReady && wavesurfer) {
      registerInstance(wavesurfer)
      wavesurfer.setPlaybackRate(playbackRate)
      wavesurfer.setVolume(0)
      wavesurfer.zoom(zoomLevel) // Apply zoom
    }
  }, [isReady, wavesurfer, volume, zoomLevel, masterVolume, playbackRate])

  useEffect(() => {
    wavesurfer?.on('scroll', onScroll)

    return () => {
      wavesurfer?.un('scroll', onScroll)
    }
  }, [wavesurfer, onScroll])

  useEffect(() => {
    if (isReady && wavesurfer) {
      // Register the WaveSurfer instance
      registerInstance(wavesurfer)

      // Add the click event listener
      wavesurfer.on('click', (relativeX) => {
        console.log(
          'Click event on track:',
          track.name,
          'RelativeX:',
          relativeX,
        )
        onClick(relativeX) // Notify parent about the click
      })
    }

    return () => {
      if (wavesurfer) {
        wavesurfer.un('click', onClick) // Cleanup on unmount
      }
    }
  }, [isReady, wavesurfer, registerInstance, onClick])

  return (
    <Box
      sx={{
        display: 'flex',
        width: 1,
        borderBottom: '1px solid #cccccc88',
        ':last-of-type': { borderBottom: 0 },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: 120,
          p: 1,
          gap: 1,
          bgcolor: 'background.paper',
        }}
      >
        <Typography sx={{ height: '20px' }}>{track.name}</Typography>
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
                borderRadius: 0,
                ':before': {
                  content: '"-"',
                  position: 'absolute',
                  bottom: '50%',
                  left: '15%',
                  color: '#555',
                },
              },
            }}
          />
        </Box>
      </Box>

      {/* Waveform */}
      <Box
        className="stem-track"
        ref={containerRef}
        sx={{
          width: 'calc(100vw - 260px)',
          height: '100px',
          borderLeft: '1px solid #ccc',
          bgcolor: 'background.default',
          cursor: 'pointer',
        }}
      >
        {!isReady && (
          <Skeleton
            variant="rectangular"
            animation="wave"
            width="100%"
            height="100%"
          />
        )}
      </Box>
    </Box>
  )
}

export default TrackComponent
