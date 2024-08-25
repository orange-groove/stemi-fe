'use client'

import React from 'react'
import { Box, Button } from '@mui/material'
import { useColorMode } from '@/components/AppThemeProvider'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'

const DarkModeToggle = () => {
  const { toggleColorMode, mode } = useColorMode()

  return (
    <Box onClick={toggleColorMode}>
      {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
    </Box>
  )
}

export default DarkModeToggle
