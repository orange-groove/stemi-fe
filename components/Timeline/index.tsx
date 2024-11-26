import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material'

interface TimelineProps {
  duration: number
  currentTime: number
  onSeek: (time: number) => void
  zoomLevel: number // The zoom level from the parent component
}

const Timeline = ({
  duration,
  currentTime,
  onSeek,
  zoomLevel,
}: TimelineProps) => {
  const [width, setWidth] = useState(800) // Default width

  // Update timeline width dynamically based on zoom level
  useEffect(() => {
    setWidth(zoomLevel * 10) // Zoom level directly affects the width (10 pixels per zoom unit)
  }, [zoomLevel])

  const handleSeek = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const newTime = (clickX / rect.width) * duration
    onSeek(newTime)
  }

  const cursorPosition = (currentTime / duration) * width

  // Generate tick marks
  const tickInterval = Math.max(1, Math.floor(10 / (zoomLevel / 100))) // Adjust interval as zoom level increases
  const ticks = Array.from(
    { length: Math.ceil(duration / tickInterval) + 1 },
    (_, i) => ({
      time: i * tickInterval,
      position: ((i * tickInterval) / duration) * width,
    }),
  )

  return (
    <Box
      sx={{
        position: 'relative',
        height: 40,
        width: `${width}px`,
        minWidth: '100%',
        backgroundColor: 'background.paper',
        cursor: 'pointer',
        borderBottom: '1px solid #ccc',
        overflow: 'hidden',
      }}
      onClick={handleSeek}
    >
      {/* Cursor */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `${cursorPosition}px`,
          width: 2,
          backgroundColor: '#ff0000',
        }}
      />

      {/* Tick Marks */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: 20,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {ticks.map((tick, index) => (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              left: `${tick.position}px`,
              transform: 'translateX(-50%)',
              textAlign: 'center',
            }}
          >
            {/* Tick */}
            <Box
              sx={{
                width: 2,
                height: 10,
                backgroundColor: '#333',
                margin: '0 auto',
              }}
            />
            {/* Label */}
            <Box
              sx={{
                fontSize: '10px',
                color: '#666',
              }}
            >
              {Math.round(tick.time)}s
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default Timeline
