'use client'

import React from 'react'
import { IconButton, Tooltip } from '@mui/material'
import { useColorMode } from '@/components/AppThemeProvider'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'

const DarkModeToggle = () => {
  const { toggleColorMode, mode } = useColorMode()

  const isDark = mode === 'dark'
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode'

  return (
    <Tooltip title={label}>
      <IconButton
        onClick={toggleColorMode}
        color="inherit"
        aria-label={label}
        aria-pressed={isDark}
      >
        {isDark ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  )
}

export default DarkModeToggle
