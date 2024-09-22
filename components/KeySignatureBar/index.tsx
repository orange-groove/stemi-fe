import { Box } from '@mui/material'
import WaveSurfer from 'wavesurfer.js'
import { useEffect, useRef } from 'react'
import _ from 'lodash'

const CCM = {
  C: '#B73F4F', // Subtle red
  'C#': '#D87F4F', // Subtle orange
  D: '#D8B63F', // Subtle yellow
  'D#': '#7FD84F', // Subtle light green
  E: '#4FD87F', // Subtle green
  F: '#4FD8B6', // Subtle teal
  'F#': '#4FD8D8', // Subtle cyan
  G: '#4F7FD8', // Subtle blue
  'G#': '#4F4FD8', // Subtle indigo
  A: '#7F4FD8', // Subtle purple
  'A#': '#D84FD8', // Subtle magenta
  B: '#D84F7F', // Subtle pink
}

const OFFSET = 0.0 // Offset to sync with the first beat

interface KeyChange {
  beat: number
  key: string
}

interface TempoChange {
  beat: number
  tempo: number
}

interface Props {
  ws: WaveSurfer
  keyChanges: any
  tempoChanges: any
}

export default function KeySignatureBar({
  ws,
  keyChanges,
  tempoChanges,
}: Props) {
  const keyChangesRef = useRef<any[]>([])
  const timeDisplayRef = useRef<HTMLDivElement>(null)
  const keyDisplayRef = useRef<HTMLDivElement>(null)
  const currentTimeRef = useRef<number>(0)
  const currentBeatRef = useRef<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const keyBarRef = useRef<HTMLDivElement>(null)
  const keyWidth = 40 // Width of each key cell

  const updateScrollPosition = (
    currentTime: number,
    duration: number,
    beat: number,
  ) => {
    // Calculate the scroll position
    if (keyBarRef.current && containerRef.current) {
      const totalBeats = Object.keys(keyChanges).length
      const totalWidth = totalBeats * (keyWidth + 10)
      const progress = currentTime / duration
      const scrollPosition =
        progress * (totalWidth - containerRef.current.clientWidth)

      keyBarRef.current.style.transform = `translateX(-${scrollPosition}px)`
      if (keyChangesRef.current?.[beat]) {
        keyChangesRef.current[beat].style.opacity = '1'
      }
      keyChangesRef.current.forEach((el, i) => {
        if (i !== beat) {
          el.style.opacity = '0.5'
        }
      })
    }
  }

  useEffect(() => {
    const updateCurrentTime = () => {
      const currentTime = ws?.getCurrentTime() + OFFSET
      const duration = ws?.getDuration() || 1 // Avoid division by zero

      const tempo = tempoChanges?.[0]?.tempo || 120 // Default tempo if not provided
      const beatInterval = 60 / tempo
      const beat = Math.floor(currentTime / beatInterval)
      const keyChange = keyChanges?.[beat] || ''

      currentBeatRef.current = beat
      currentTimeRef.current = currentTime

      if (timeDisplayRef.current) {
        timeDisplayRef.current.textContent = `${currentTimeRef.current.toFixed(2)}s`
      }

      if (keyDisplayRef.current) {
        keyDisplayRef.current.textContent = keyChange?.key
      }

      updateScrollPosition(currentTime, duration, beat)
    }

    if (ws) {
      ws.on('audioprocess', updateCurrentTime)
    }

    return () => {
      if (ws) {
        ws.un('audioprocess', updateCurrentTime)
      }
    }
  }, [ws])

  return (
    keyChanges && (
      <Box
        ref={containerRef}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          whiteSpace: 'nowrap',
        }}
      >
        <Box
          ref={keyBarRef}
          sx={{
            display: 'flex',
            gap: 0.5,
            whiteSpace: 'nowrap',
            width: 'fit-content',
            height: '100%',
            position: 'relative',
            transition: 'transform 0.01s ease-in-out',
            left: `100px`,
          }}
        >
          {keyChanges.map((keyChange: string, beat: number) => (
            <Box
              ref={(el: any) => (keyChangesRef.current[beat] = el)}
              key={beat}
              sx={{
                bgcolor: CCM[keyChange as keyof typeof CCM] || '#ccc',
                color: 'white',
                borderRadius: 2,
                border: '1px solid white',
                p: 0.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: keyWidth,
                height: 40,
                transition: 'transform 0.01s ease-in-out',
                opacity: 0.5,
              }}
            >
              {keyChange}
            </Box>
          ))}
        </Box>

        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%' }}>
          {/* Highlighted Key Position Marker */}
          <Box
            sx={{
              position: 'absolute',
              left: `calc(${(Object.keys(keyChanges).length * keyWidth) / 2}px - 20px)`,
              width: 40,
              height: '100%',
              bgcolor: 'rgba(255,255,255,0.5)',
              border: '1px solid black',
              zIndex: 10,
            }}
          />
        </Box>
      </Box>
    )
  )
}
