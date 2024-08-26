import { useEffect, useState } from 'react'
import io from 'socket.io-client'

const useSocket = (url) => {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const socketInstance = io(url)
    setSocket(socketInstance)

    console.log('WebSocket connected:', socketInstance.connected)

    socketInstance.on('connect', () => {
      console.log('WebSocket connected!')
    })

    socketInstance.on('disconnect', () => {
      console.log('WebSocket disconnected!')
    })

    return () => {
      socketInstance.disconnect()
    }
  }, [url])

  return { socket }
}

export default useSocket
