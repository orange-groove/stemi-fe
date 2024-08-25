import React, { useState, useEffect } from 'react'

const AudioInputSelector = ({ onDeviceSelect }) => {
  const [devices, setDevices] = useState([])
  const [selectedDeviceId, setSelectedDeviceId] = useState('')

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((deviceInfos) => {
      const audioInputDevices = deviceInfos.filter(
        (device) => device.kind === 'audioinput',
      )
      setDevices(audioInputDevices)
      if (audioInputDevices.length > 0) {
        setSelectedDeviceId(audioInputDevices[0].deviceId)
      }
    })
  }, [])

  const handleDeviceChange = (event) => {
    setSelectedDeviceId(event.target.value)
    onDeviceSelect(event.target.value)
  }

  return (
    <div>
      <label htmlFor="audio-input">Select Audio Input: </label>
      <select
        id="audio-input"
        value={selectedDeviceId}
        onChange={handleDeviceChange}
      >
        {devices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || `Microphone ${device.deviceId}`}
          </option>
        ))}
      </select>
    </div>
  )
}

export default AudioInputSelector
