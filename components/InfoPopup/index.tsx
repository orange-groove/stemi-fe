import { Box } from '@mui/material'
import { useEffect, useState } from 'react'

export default function InfoPopup({ popups }: { popups: string[] }) {
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  useEffect(() => {
    setTimeout(() => {
      popups && setCurrentIndex((prev) => (prev + 1) % popups.length)
    }, 1000)
  }, [popups])

  return popups && <Box>{popups[currentIndex]}</Box>
}
