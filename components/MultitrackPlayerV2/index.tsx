import React, { useState, useEffect, useRef } from 'react'
import * as Tone from 'tone'
import {
  Box,
  Button,
  Typography,
  Slider,
  Tooltip,
  Checkbox,
  Select,
  MenuItem,
} from '@mui/material'
import TrackComponent from './Track'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import FirstPageIcon from '@mui/icons-material/FirstPage'
import { Track } from '@/api/client'
import useDownloadStems from '@/hooks/useDownloadStems'
import useDownloadMixdown from '@/hooks/useDownloadMixdown'

interface MultitrackPlayerProps {
  tracks?: Track[]
  songId: number
}

const MultitrackPlayer = ({ tracks, songId }: MultitrackPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [masterVolume, setMasterVolume] = useState(1)
  const [playbackRate, setPlaybackRate] = useState(1)
  const waveSurferInstances = useRef<Map<string, any>>(new Map())
  const grainPlayers = useRef<Map<string, Tone.GrainPlayer>>(new Map())
  const [volumeMap, setVolumeMap] = useState<Map<string, number>>(
    new Map(tracks?.map((track) => [track.name!, 1])),
  )
  const [muteMap, setMuteMap] = useState<Map<string, boolean>>(
    new Map(tracks?.map((track) => [track.name!, false])),
  )
  const [soloMap, setSoloMap] = useState<Map<string, boolean>>(
    new Map(tracks?.map((track) => [track.name!, false])),
  )

  const [selectedTracks, setSelectedTracks] = useState([])
  const [downloadFileType, setDownloadFileType] = useState('wav')

  const { mutate: downloadStems } = useDownloadStems()
  const { mutate: downloadMixdown } = useDownloadMixdown()

  // Initialize GrainPlayers
  useEffect(() => {
    tracks?.forEach((track) => {
      const grainPlayer = new Tone.GrainPlayer({
        url: track.url,
        loop: false,
      }).toDestination()

      grainPlayer.sync().start(0)
      grainPlayers.current.set(track.name!, grainPlayer)
    })

    return () => {
      grainPlayers.current.forEach((player) => player.dispose())
    }
  }, [tracks])

  // Synchronize WaveSurfer cursor with Tone.Transport
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Tone.getContext().transport.seconds
      waveSurferInstances.current.forEach((ws) =>
        ws.seekTo(currentTime / ws.getDuration()),
      )
    }, 100) // Sync every 100ms

    return () => clearInterval(interval)
  }, [])

  // Handle play/pause
  const handlePlayPause = async () => {
    if (isPlaying) {
      Tone.getContext().transport.pause()
    } else {
      await Tone.start()
      Tone.getContext().transport.start()
    }
    setIsPlaying(!isPlaying)
  }

  // Seek all tracks
  const handleSeek = (newTime: number) => {
    Tone.getContext().transport.seconds = newTime
    // @ts-ignore
    grainPlayers.current.forEach((player) => (player.seek = newTime))
    waveSurferInstances.current.forEach((ws) =>
      ws.seekTo(newTime / ws.getDuration()),
    )
  }

  // Adjust playback rate
  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate)
    grainPlayers.current.forEach((player) => (player.playbackRate = rate))
    Tone.getContext().transport.bpm.value = 120 * rate // Sync Tone.Transport
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

  const handleBackToStartClick = () => {
    Tone.getContext().transport.stop()
    Tone.getContext().transport.position = 0
    waveSurferInstances.current.forEach((ws) => ws.seekTo(0))
    setIsPlaying(false)
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

  const handleCheckboxChange = (trackName) => {
    setSelectedTracks(
      (prevSelectedTracks) =>
        prevSelectedTracks.includes(trackName)
          ? prevSelectedTracks.filter((track) => track !== trackName) // Remove if unchecked
          : [...prevSelectedTracks, trackName], // Add if checked
    )
  }

  const handleSelectAllChange = (e, isChecked: boolean) => {
    if (isChecked) {
      // Select all track names
      setSelectedTracks(tracks?.map((track) => track.name))
    } else {
      // Deselect all tracks
      setSelectedTracks([])
    }
  }

  const handleDownloadStems = () => {
    downloadStems({
      songId,
      stems:
        selectedTracks.length === 0
          ? tracks?.map((track) => track.name)
          : selectedTracks,
      fileType: downloadFileType,
    })
  }

  const handleDownloadMixdown = () => {
    downloadMixdown({
      songId,
      stems:
        selectedTracks.length === 0
          ? tracks?.map((track) => track.name)
          : selectedTracks,
      fileType: downloadFileType,
    })
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Checkbox
            sx={{ m: 1 }}
            onChange={handleSelectAllChange}
            checked={selectedTracks.length === tracks?.length}
          />

          <Button onClick={handleDownloadStems}>Download Stems</Button>
          <Button onClick={handleDownloadStems}>Download Mixdown</Button>
          <Select
            labelId="file-type-select-label"
            id="file-type-select"
            value={downloadFileType}
            label="Age"
            onChange={(e) => setDownloadFileType(e.target.value)}
            size="small"
          >
            <MenuItem value="wav">WAV</MenuItem>
            <MenuItem value="mp3">MP3</MenuItem>
            <MenuItem value="ogg">OGG</MenuItem>
          </Select>
        </Box>

        {/* Transport and Playback Rate Controls */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            pr: 1,
          }}
        >
          <Tooltip title="Play">
            <Button onClick={handlePlayPause}>
              {isPlaying ? (
                <PauseIcon color="warning" sx={{ fontSize: 40 }} />
              ) : (
                <PlayArrowIcon color="success" sx={{ fontSize: 40 }} />
              )}
            </Button>
          </Tooltip>
          <Tooltip title="Back to start">
            <Button onClick={handleBackToStartClick}>
              <FirstPageIcon sx={{ fontSize: 40 }}>Back to Start</FirstPageIcon>
            </Button>
          </Tooltip>

          <Box sx={{ ml: 2 }}>
            <Typography>Playback Rate</Typography>
            <Slider
              value={playbackRate}
              onChange={(e, value) => handlePlaybackRateChange(value as number)}
              min={0.5}
              max={2}
              step={0.01}
              sx={{
                '& .MuiSlider-thumb': {
                  height: 14,
                  width: 16,
                  backgroundColor: '#fff',
                  border: '2px solid currentColor',
                  borderRadius: 0,
                },
              }}
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
              sx={{
                '& .MuiSlider-thumb': {
                  height: 14,
                  width: 16,
                  backgroundColor: '#fff',
                  border: '2px solid currentColor',
                  borderRadius: 0,
                },
              }}
            />
          </Box>
        </Box>
      </Box>
      {/* Tracks */}
      <Box sx={{ border: '1px solid #cccccc88', borderRadius: 1 }}>
        {tracks?.map((track) => (
          <Box
            key={track.name}
            sx={{ display: 'flex', width: '100%', alignItems: 'center' }}
          >
            <Checkbox
              sx={{ m: 1 }}
              onChange={() => handleCheckboxChange(track.name)}
              checked={selectedTracks.includes(track.name)}
            />
            <TrackComponent
              track={track}
              playbackRate={playbackRate}
              onSeek={handleSeek}
              registerInstance={(ws) => {
                waveSurferInstances.current.set(track.name!, ws)
              }}
              volume={volumeMap.get(track.name!) || 1}
              masterVolume={masterVolume}
              isMuted={muteMap.get(track.name!) || false}
              isSoloed={soloMap.get(track.name!) || false}
              onVolumeChange={(volume) =>
                handleTrackVolumeChange(track.name!, volume)
              }
              onMute={() => handleMute(track.name!)}
              onSolo={() => handleSolo(track.name!)}
            />
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default MultitrackPlayer
