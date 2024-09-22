import { useEffect, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'
import { Box, Slider, SliderProps, Typography } from '@mui/material'

interface Props {
  ws: WaveSurfer[]
}

export default function PlaybackRateSlider({ ws }: Props) {
  const [playbackRate, setPlaybackRate] = useState<number>(1) // Default playback rate is 1 (normal speed)

  useEffect(() => {
    if (ws?.length > 0) {
      ws.forEach((ws) => {
        ws.setPlaybackRate(playbackRate)
      })
    }
  }, [playbackRate, ws])

  const handlePlaybackRateChange: SliderProps['onChange'] = (
    event,
    newValue,
  ) => {
    setPlaybackRate(newValue as number)
  }

  return (
    <Box>
      <Box sx={{ marginTop: 2 }}>
        <Typography>Playback Speed</Typography>
        <Slider
          value={playbackRate}
          onChange={handlePlaybackRateChange}
          min={0.5} // Minimum speed (half speed)
          max={2.0} // Maximum speed (double speed)
          step={0.1} // Adjust the step as needed
          aria-labelledby="playback-speed-slider"
          valueLabelDisplay="auto"
        />
      </Box>
    </Box>
  )
}
