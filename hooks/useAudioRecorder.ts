import { useState, useRef } from 'react'

export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder>()
  const audioChunksRef = useRef<any[]>([])

  const startRecording = async (deviceId: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: deviceId ? { exact: deviceId } : undefined },
      })

      mediaRecorderRef.current = new MediaRecorder(stream)
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/mp3',
        })
        const audioUrl = URL.createObjectURL(audioBlob)
        audioChunksRef.current = [] // Clear the chunks after creating the Blob
        return audioBlob
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error starting recording:', error)
    }
  }

  const stopRecording = () => {
    return new Promise((resolve) => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.onstop = () => {
          setIsRecording(false)
          const audioBlob = new Blob(audioChunksRef.current, {
            type: 'audio/mp3',
          })
          audioChunksRef.current = [] // Clear the chunks after creating the Blob
          resolve(audioBlob)
        }
        mediaRecorderRef.current.stop()
      }
    })
  }

  return { isRecording, startRecording, stopRecording }
}
