'use client'

import React, { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  Box,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
} from '@mui/material'
import { UploadFile, Download, Delete } from '@mui/icons-material'
import useProcessSong from '@/hooks/useProcessSong'
import useGetSessionPreview from '@/hooks/useGetSessionPreview'
import useDownloadSessionStems from '@/hooks/useDownloadSessionStems'
import useDownloadSessionMixdown from '@/hooks/useDownloadSessionMixdown'
import useDeleteSession from '@/hooks/useDeleteSession'
import MultitrackPlayer from '@/components/MultitrackPlayerV2'
import { client as apiClient, getSessionStem } from '@/api/client/services.gen'
import config from '@/config'

const SessionSongProcessor = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [fileType, setFileType] = useState('mp3')
  const [tracks, setTracks] = useState<Array<{ name: string; url: string }>>([])
  const [tracksLoading, setTracksLoading] = useState(false)
  const [selectedTracks, setSelectedTracks] = useState<string[]>([])

  // Check for session ID in URL on component mount
  useEffect(() => {
    const urlSessionId = searchParams.get('sessionId')
    if (urlSessionId) {
      setSessionId(urlSessionId)
    }
  }, [searchParams])

  // Update URL when session ID is set from processing
  useEffect(() => {
    if (sessionId && !searchParams.get('sessionId')) {
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.set('sessionId', sessionId)
      router.replace(newUrl.pathname + newUrl.search)
    }
  }, [sessionId, searchParams, router])

  const processSongMutation = useProcessSong()
  const {
    data: preview,
    isLoading: previewLoading,
    error: previewError,
  } = useGetSessionPreview(sessionId)
  const downloadStemsMutation = useDownloadSessionStems()
  const downloadMixdownMutation = useDownloadSessionMixdown()
  const deleteSessionMutation = useDeleteSession()

  // Create tracks with blob URLs when preview data changes
  useEffect(() => {
    const createTracksWithBlobs = async () => {
      if (preview?.available_stems && sessionId) {
        setTracksLoading(true)
        try {
          const tracksWithBlobs = await Promise.all(
            preview.available_stems.map(async (stem) => {
              try {
                console.log('Fetching stem:', stem, 'for session:', sessionId)

                const response = await getSessionStem({
                  path: {
                    session_id: sessionId,
                    stem_name: stem,
                  },
                  responseType: 'blob',
                })

                const blob = new Blob([response.data!], { type: 'audio/mpeg' })
                const url = URL.createObjectURL(blob)

                return {
                  name: stem,
                  url: url,
                }
              } catch (error) {
                console.error(`Error fetching ${stem}:`, error)
                // Return a fallback URL that might work
                return {
                  name: stem,
                  url: `${config.baseApiUrl}/session/${sessionId}/stem/${stem}`,
                }
              }
            }),
          )
          setTracks(tracksWithBlobs)
        } catch (error) {
          console.error('Error creating tracks:', error)
          setTracks([])
        } finally {
          setTracksLoading(false)
        }
      } else {
        setTracks([])
        setTracksLoading(false)
      }
    }

    createTracksWithBlobs()
  }, [preview?.available_stems, sessionId])

  // Cleanup blob URLs when component unmounts or tracks change
  useEffect(() => {
    return () => {
      tracks.forEach((track) => {
        if (track.url.startsWith('blob:')) {
          URL.revokeObjectURL(track.url)
        }
      })
    }
  }, [tracks])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        processSongMutation.mutate(
          { file },
          {
            onSuccess: (data) => {
              setSessionId(data?.session_id || null)
              setSelectedTracks([])
            },
            onError: (error) => {
              console.error('Error processing song:', error)
            },
          },
        )
      }
    },
    accept: {
      'audio/mpeg': ['.mp3'],
      'audio/wav': ['.wav'],
    },
    maxFiles: 1,
  })

  const handleDownloadStems = () => {
    if (sessionId && preview?.available_stems) {
      const stemsToDownload =
        selectedTracks.length > 0 ? selectedTracks : preview.available_stems
      downloadStemsMutation.mutate({
        sessionId,
        stems: stemsToDownload,
        fileType,
      })
    }
  }

  const handleDownloadMixdown = () => {
    if (sessionId && preview?.available_stems) {
      const stemsToDownload =
        selectedTracks.length > 0 ? selectedTracks : preview.available_stems
      downloadMixdownMutation.mutate({
        sessionId,
        stems: stemsToDownload,
        fileType,
      })
    }
  }

  const handleFinish = () => {
    if (sessionId) {
      deleteSessionMutation.mutate(
        { sessionId },
        {
          onSuccess: () => {
            setSessionId(null)
            setSelectedTracks([])
          },
          onError: (error) => {
            console.error('Error deleting session:', error)
          },
        },
      )
    }
  }

  // Tracks are now created in useEffect with authorization tokens

  if (!sessionId) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Upload a Song to Get Started
        </Typography>

        <Box
          {...getRootProps()}
          sx={{
            border: '2px dashed #ccc',
            borderRadius: 2,
            p: 4,
            cursor: 'pointer',
            backgroundColor: isDragActive ? '#f5f5f5' : 'transparent',
            '&:hover': {
              backgroundColor: '#f5f5f5',
            },
          }}
        >
          <input {...getInputProps()} />
          <UploadFile sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />
          <Typography variant="h6">
            {isDragActive
              ? 'Drop the audio file here...'
              : 'Drag & drop an audio file here, or click to select'}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            Supports MP3 and WAV files
          </Typography>
        </Box>

        {processSongMutation.isPending && (
          <Box
            sx={{
              mt: 2,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <CircularProgress size={20} />
            <Typography>Processing song...</Typography>
          </Box>
        )}

        {processSongMutation.error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Error processing song: {processSongMutation.error.message}
          </Alert>
        )}
      </Box>
    )
  }

  if (previewLoading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress size={40} />
        <Typography sx={{ mt: 2 }}>Loading preview...</Typography>
      </Box>
    )
  }

  if (previewError) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Session Not Found
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            The session ID "{sessionId}" could not be found or has expired. This
            could happen if:
          </Typography>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>The session has been deleted or expired</li>
            <li>The session ID is incorrect</li>
            <li>The backend service is unavailable</li>
          </ul>
        </Alert>
        <Button
          variant="contained"
          onClick={() => {
            setSessionId(null)
            setSelectedTracks([])
            // Clear the URL parameter
            const newUrl = new URL(window.location.href)
            newUrl.searchParams.delete('sessionId')
            router.replace(newUrl.pathname + newUrl.search)
          }}
        >
          Start New Session
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 4 }}>
      <Button
        variant="outlined"
        color="error"
        startIcon={<Delete />}
        onClick={handleFinish}
        disabled={deleteSessionMutation.isPending}
      >
        Finish
      </Button>

      {preview?.available_stems && (
        <>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>File Type</InputLabel>
                <Select
                  value={fileType}
                  label="File Type"
                  onChange={(e) => setFileType(e.target.value)}
                >
                  <MenuItem value="mp3">MP3</MenuItem>
                  <MenuItem value="wav">WAV</MenuItem>
                  <MenuItem value="ogg">OGG</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={handleDownloadStems}
                disabled={downloadStemsMutation.isPending}
              >
                Download Selected Stems
              </Button>

              <Button
                variant="contained"
                color="secondary"
                startIcon={<Download />}
                onClick={handleDownloadMixdown}
                disabled={downloadMixdownMutation.isPending}
              >
                Download Mixdown
              </Button>
            </Box>
          </Box>

          <Box sx={{ mb: 4 }}>
            {tracksLoading ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: 4,
                }}
              >
                <CircularProgress size={40} />
                <Typography sx={{ ml: 2 }}>Loading audio tracks...</Typography>
              </Box>
            ) : (
              <MultitrackPlayer
                tracks={tracks}
                hideDownloadButtons={false}
                onTracksSelected={setSelectedTracks}
              />
            )}
          </Box>
        </>
      )}
    </Box>
  )
}

export default SessionSongProcessor
