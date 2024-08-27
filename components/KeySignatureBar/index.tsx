import { Box, Typography } from '@mui/material'
import WaveSurfer from 'wavesurfer.js'
import { useEffect, useRef, useState } from 'react'
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
  keyChanges: { [beat: number]: KeyChange }
  tempoChanges: TempoChange[]
}

export default function KeySignatureBar({
  ws,
  keyChanges,
  tempoChanges,
}: Props) {
  const [highlightedKey, setHighlightedKey] = useState<string>()
  const timeDisplayRef = useRef<HTMLDivElement>(null)
  const keyDisplayRef = useRef<HTMLDivElement>(null)
  const currentTimeRef = useRef(0)
  const currentBeatRef = useRef<number>(0)

  useEffect(() => {
    const updateCurrentTime = () => {
      const currentTime = ws?.getCurrentTime() || 0
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

      setHighlightedKey(keyChange?.key)
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
      <>
        <Box
          sx={{ display: 'flex', gap: 2, overflow: 'hidden', width: '20000px' }}
        >
          {Object.entries(keyChanges).map(([beat, keyChange]) => (
            <Box
              key={beat}
              sx={{
                bgcolor: CCM[keyChange.key] || '#ccc', // Default color if key is not found
                color: 'white',
                borderRadius: 2,
                p: 0.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                opacity: currentBeatRef.current === Number(beat) ? 1 : 0.5,
                zoom: currentBeatRef.current === Number(beat) ? 1.5 : 1,
              }}
            >
              {keyChange.key}
            </Box>
          ))}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
          <div ref={timeDisplayRef}>
            {/* Initial content or placeholder */}
            Current Time: 0.00s
          </div>
          <div ref={keyDisplayRef}>
            {/* Initial content or placeholder */}
            Key: Unknown
          </div>
        </Box>
      </>
    )
  )
}
