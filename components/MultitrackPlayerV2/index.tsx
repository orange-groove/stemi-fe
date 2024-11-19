import React, { useState, useEffect, useRef } from 'react'
import * as Tone from 'tone'
import { Box, Button, Typography, Slider } from '@mui/material'
import TrackComponent from './Track'

interface Track {
  name: string
  url: string
}

interface MultitrackPlayerProps {
  tracks: Track[]
}

const MultitrackPlayer = ({ tracks }: MultitrackPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [masterVolume, setMasterVolume] = useState(1)
  const [playbackRate, setPlaybackRate] = useState(1)
  const waveSurferInstances = useRef<Map<string, any>>(new Map())
  const grainPlayers = useRef<Map<string, Tone.GrainPlayer>>(new Map())
  const [volumeMap, setVolumeMap] = useState<Map<string, number>>(
    new Map(tracks.map((track) => [track.name, 1])),
  )
  const [muteMap, setMuteMap] = useState<Map<string, boolean>>(
    new Map(tracks.map((track) => [track.name, false])),
  )
  const [soloMap, setSoloMap] = useState<Map<string, boolean>>(
    new Map(tracks.map((track) => [track.name, false])),
  )

  // Initialize GrainPlayers
  useEffect(() => {
    tracks.forEach((track) => {
      const grainPlayer = new Tone.GrainPlayer({
        url: track.url,
        loop: false,
      }).toDestination()

      grainPlayer.sync().start(0)
      grainPlayers.current.set(track.name, grainPlayer)
    })

    return () => {
      grainPlayers.current.forEach((player) => player.dispose())
    }
  }, [tracks])

  // Synchronize WaveSurfer cursor with Tone.Transport
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Tone.Transport.seconds
      waveSurferInstances.current.forEach((ws) =>
        ws.seekTo(currentTime / ws.getDuration()),
      )
    }, 100) // Sync every 100ms

    return () => clearInterval(interval)
  }, [])

  // Handle play/pause
  const handlePlayPause = async () => {
    if (isPlaying) {
      Tone.Transport.pause()
    } else {
      await Tone.start()
      Tone.Transport.start()
    }
    setIsPlaying(!isPlaying)
  }

  // Seek all tracks
  const handleSeek = (newTime: number) => {
    Tone.Transport.seconds = newTime
    grainPlayers.current.forEach((player) => (player.seek = newTime))
    waveSurferInstances.current.forEach((ws) =>
      ws.seekTo(newTime / ws.getDuration()),
    )
  }

  // Adjust playback rate
  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate)
    grainPlayers.current.forEach((player) => (player.playbackRate = rate))
    Tone.Transport.bpm.value = 120 * rate // Sync Tone.Transport
  }

  // Adjust master volume
  const handleMasterVolumeChange = (volume: number) => {
    setMasterVolume(volume)
    updateTrackVolumes(volumeMap, muteMap, soloMap, volume)
  }

  // Adjust individual track volume
  const handleTrackVolumeChange = (trackName: string, volume: number) => {
    setVolumeMap((prev) => {
      const newVolumeMap = new Map(prev).set(trackName, volume)
      updateTrackVolumes(newVolumeMap, muteMap, soloMap, masterVolume)
      return newVolumeMap
    })
  }

  // Mute a track
  const handleMute = (trackName: string) => {
    setMuteMap((prev) => {
      const newMuteMap = new Map(prev).set(
        trackName,
        !(prev.get(trackName) || false),
      )
      updateTrackVolumes(volumeMap, newMuteMap, soloMap, masterVolume)
      return newMuteMap
    })
  }

  // Solo a track
  const handleSolo = (trackName: string) => {
    setSoloMap((prev) => {
      const newSoloMap = new Map(prev).set(
        trackName,
        !(prev.get(trackName) || false),
      )
      updateTrackVolumes(volumeMap, muteMap, newSoloMap, masterVolume)
      return newSoloMap
    })
  }

  // Update track volumes
  const updateTrackVolumes = (
    volumeMap: Map<string, number>,
    muteMap: Map<string, boolean>,
    soloMap: Map<string, boolean>,
    masterVolume: number,
  ) => {
    const soloActive = Array.from(soloMap.values()).some((solo) => solo)

    grainPlayers.current.forEach((player, trackName) => {
      const isMuted = muteMap.get(trackName) || false
      const isSoloed = soloMap.get(trackName) || false

      let effectiveVolume = 0
      if (soloActive) {
        effectiveVolume = isSoloed
          ? volumeMap.get(trackName)! * masterVolume
          : 0
      } else {
        effectiveVolume = !isMuted
          ? volumeMap.get(trackName)! * masterVolume
          : 0
      }

      player.volume.value = Tone.gainToDb(effectiveVolume)
    })
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5">Multitrack Player</Typography>

      {/* Transport and Playback Rate Controls */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button variant="contained" onClick={handlePlayPause}>
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            Tone.Transport.stop()
            Tone.Transport.seconds = 0
            waveSurferInstances.current.forEach((ws) => ws.seekTo(0))
            setIsPlaying(false)
          }}
        >
          Restart
        </Button>
        <Box sx={{ ml: 2 }}>
          <Typography>Playback Rate</Typography>
          <Slider
            value={playbackRate}
            onChange={(e, value) => handlePlaybackRateChange(value as number)}
            min={0.5}
            max={2}
            step={0.01}
          />
        </Box>
        <Box sx={{ ml: 2 }}>
          <Typography>Master Volume</Typography>
          <Slider
            value={masterVolume}
            onChange={(e, value) => handleMasterVolumeChange(value as number)}
            min={0}
            max={1}
            step={0.01}
          />
        </Box>
      </Box>

      {/* Tracks */}
      <Box>
        {tracks.map((track) => (
          <TrackComponent
            key={track.name}
            track={track}
            playbackRate={playbackRate}
            onSeek={handleSeek}
            registerInstance={(ws) => {
              waveSurferInstances.current.set(track.name, ws)
            }}
            volume={volumeMap.get(track.name) || 1}
            masterVolume={masterVolume}
            isMuted={muteMap.get(track.name) || false}
            isSoloed={soloMap.get(track.name) || false}
            onVolumeChange={(volume) =>
              handleTrackVolumeChange(track.name, volume)
            }
            onMute={() => handleMute(track.name)}
            onSolo={() => handleSolo(track.name)}
          />
        ))}
      </Box>
    </Box>
  )
}

export default MultitrackPlayer
