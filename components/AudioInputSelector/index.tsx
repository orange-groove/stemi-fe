import React, { useState, useEffect } from 'react'

const AudioInputSelector = ({ onDeviceSelect }) => {
  const [devices, setDevices] = useState([])

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((deviceInfos) => {
      const audioDevices = deviceInfos.filter(
        (device) => device.kind === 'audioinput',
      )
      setDevices(audioDevices)
    })
  }, [])

  return (
    <select onChange={(e) => onDeviceSelect(e.target.value)}>
      <option value="">Select an Audio Input</option>
      {devices.map((device) => (
        <option key={device.deviceId} value={device.deviceId}>
          {device.label || `Device ${device.deviceId}`}
        </option>
      ))}
    </select>
  )
}

export default AudioInputSelector
