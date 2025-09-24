'use client'

import React, { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  Box,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
} from '@mui/material'
import { UploadFile, Download, Delete } from '@mui/icons-material'
import supabase from '@/lib/supabase'
import useProcessSong from '@/hooks/useProcessSong'
import useGetSessionPreview from '@/hooks/useGetSessionPreview'
import useDownloadSessionStems from '@/hooks/useDownloadSessionStems'
import useDownloadSessionMixdown from '@/hooks/useDownloadSessionMixdown'
import useDeleteSession from '@/hooks/useDeleteSession'
import MultitrackPlayer from '@/components/MultitrackPlayerV2'
import UsageCounter from '@/components/UsageCounter'
import UpgradeModal from '@/components/UpgradeModal'
import { client as apiClient, getSessionStem } from '@/api/client/services.gen'
import config from '@/config'
import { useUsage } from '@/hooks/useUsage'
import '@/lib/axios'

const SessionSongProcessor = () => {
  console.log('SessionSongProcessor component rendering')

  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false)
  const [upgradeMessage, setUpgradeMessage] = useState('')
  const searchParams = useSearchParams()
  const router = useRouter()
  const { usage, refetch: refetchUsage } = useUsage()

  // Debug usage data
  useEffect(() => {
    console.log('SessionSongProcessor - Usage data:', usage)
  }, [usage])
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [fileType, setFileType] = useState('mp3')
  const [tracks, setTracks] = useState<Array<{ name: string; url: string }>>([])
  const [tracksLoading, setTracksLoading] = useState(false)
  const [selectedTracks, setSelectedTracks] = useState<string[]>([])

  // Check for session ID in URL on mount
  useEffect(() => {
    const urlSessionId = searchParams.get('sessionId')
    if (urlSessionId) {
      setSessionId(urlSessionId)
    }
  }, [searchParams])

  // Clean up URL when returning from checkout
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('checkout') === 'success') {
      // Clean up URL
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('checkout')
      router.replace(newUrl.pathname + newUrl.search)
    }
  }, [router])

  const startCheckout = async () => {
    setCheckoutLoading(true)
    try {
      const successUrl = `${window.location.origin}/stems?checkout=success`
      const cancelUrl = `${window.location.origin}/stems?checkout=cancel`
      const res = await apiClient.instance.post(
        config.baseApiUrl + '/billing/checkout',
        {
          success_url: successUrl,
          cancel_url: cancelUrl,
        },
      )
      const { url } = res.data
      // Redirect in the same window, not a new tab
      window.location.assign(url)
    } catch (e) {
      console.error('Failed to start checkout', e)
    } finally {
      setCheckoutLoading(false)
    }
  }

  // Ensure URL always reflects current sessionId
  useEffect(() => {
    if (!sessionId) return

    const newUrl = new URL(window.location.href)
    const current = newUrl.searchParams.get('sessionId')
    if (current !== sessionId) {
      newUrl.searchParams.set('sessionId', sessionId)
      router.replace(newUrl.pathname + newUrl.search)
    }
  }, [sessionId, router])

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
      // If tracks were already seeded from process response (stem_urls), skip refetching
      if (tracks.length > 0) return
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
  }, [preview?.available_stems, sessionId, tracks.length])

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

        // Check usage before processing
        if (usage && !usage.can_process) {
          if (!usage.is_premium) {
            setUpgradeMessage(
              `You've used ${usage.current_usage}/${usage.monthly_limit} free songs. Upgrade for more!`,
            )
            setUpgradeModalOpen(true)
          } else {
            setUpgradeMessage(
              `Monthly limit reached (${usage.monthly_limit}). Resets next month.`,
            )
            setUpgradeModalOpen(true)
          }
          return
        }

        processSongMutation.mutate(
          { file },
          {
            onSuccess: (data) => {
              // Set session id
              setSessionId(data?.session_id || null)
              setSelectedTracks([])

              // If backend returns direct stem URLs, seed tracks immediately
              if (data?.stem_urls) {
                const seeded = Object.entries(data.stem_urls).map(
                  ([name, url]) => ({
                    name,
                    url: url as string,
                  }),
                )
                setTracks(seeded)
              }

              // Refresh usage after successful processing
              refetchUsage()
            },
            onError: (error: any) => {
              console.error('Error processing song:', error)

              // Handle usage limit errors
              if (error.isUsageLimit) {
                if (!error.isPremium) {
                  setUpgradeMessage(error.message)
                  setUpgradeModalOpen(true)
                } else {
                  setUpgradeMessage(error.message)
                  setUpgradeModalOpen(true)
                }
              }
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
            // Clear the URL parameter when session is deleted
            const newUrl = new URL(window.location.href)
            newUrl.searchParams.delete('sessionId')
            router.replace(newUrl.pathname + newUrl.search)
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
    if (processSongMutation.isPending) {
      return (
        <Box
          sx={{
            p: 6,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <CircularProgress size={96} thickness={4} />
          <Typography sx={{ mt: 2 }}>Processing stems...</Typography>
        </Box>
      )
    }

    return (
      <Box
        sx={{
          p: 4,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <UsageCounter />
        <Typography variant="h4" sx={{ mb: 4 }}>
          Upload a Song to Get Started
        </Typography>

        <Box
          {...getRootProps()}
          sx={{
            border: '2px dashed #ccc',
            borderRadius: '50%',
            width: ['200px', '400px'],
            height: ['200px', '400px'],
            p: 4,
            cursor: usage && !usage.can_process ? 'not-allowed' : 'pointer',
            backgroundColor: isDragActive ? '#f5f5f5' : 'transparent',
            opacity: usage && !usage.can_process ? 0.5 : 1,
            '&:hover': {
              backgroundColor:
                usage && !usage.can_process ? 'transparent' : '#f5f5f5',
            },
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <input {...getInputProps()} />
          <UploadFile
            sx={{ fontSize: ['40px', '60px'], mb: 2, color: 'primary.main' }}
          />
          <Typography fontSize={['16px', '24px']}>
            {usage && !usage.can_process
              ? usage.is_premium
                ? 'Monthly limit reached'
                : 'Upgrade to upload more'
              : isDragActive
                ? 'Drop the audio file here...'
                : 'Drag & drop an audio file here, or click to select'}
          </Typography>
          <Typography
            fontSize={['12px', '16px']}
            sx={{ mt: 1, color: 'text.secondary' }}
          >
            {usage && !usage.can_process
              ? usage.is_premium
                ? 'Resets next month'
                : `${usage.current_usage}/${usage.monthly_limit} free songs used`
              : 'Supports MP3 and WAV files'}
          </Typography>
        </Box>

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
      <Box sx={{ p: [0, 4] }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Session Not Found
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            The session ID {sessionId} could not be found or has expired. This
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
    <Box sx={{ p: [0, 4] }}>
      {preview?.available_stems && (
        <>
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                mb: 2,
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
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

              <Box sx={{ display: 'flex', gap: 2, px: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<Download />}
                  onClick={handleDownloadStems}
                  disabled={downloadStemsMutation.isPending}
                >
                  Download Stems
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

      <UpgradeModal
        open={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        message={upgradeMessage}
        currentUsage={usage?.current_usage}
        monthlyLimit={usage?.monthly_limit}
      />
    </Box>
  )
}

export default SessionSongProcessor
