import React, { useEffect, useMemo, useRef } from 'react'
import {
  Box,
  Button,
  Slider,
  Typography,
  CircularProgress,
  useTheme,
} from '@mui/material'
import { useWavesurfer } from '@wavesurfer/react'
import { Track } from '@/api/client'
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js'

interface TrackComponentProps {
  isFirst: boolean
  track: Track
  zoomLevel: number
  playbackRate: number
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
  isFirst,
  track,
  zoomLevel,
  playbackRate,
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
    waveColor: theme.palette.primary.main,
    progressColor: theme.palette.primary.light,
    cursorColor: '#FFAA00',
    height: 100,
    backend: 'WebAudio',
    hideScrollbar: true,
    plugins: useMemo(() => (isFirst ? [topTimeline] : []), []),
  })

  useEffect(() => {
    if (isReady && wavesurfer) {
      registerInstance(wavesurfer)
      wavesurfer.setPlaybackRate(playbackRate)
      wavesurfer.setVolume(0)
      wavesurfer.zoom(zoomLevel) // Apply zoom
    }
  }, [isReady, wavesurfer, volume, zoomLevel, masterVolume, playbackRate])

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
          width: '100%',
          height: '100px',
          borderLeft: '1px solid #ccc',
          bgcolor: 'background.default',
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
      >
        {!isReady && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default TrackComponent
