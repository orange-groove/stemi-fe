import React, {
  useState,
  useMemo,
  createContext,
  useContext,
  useEffect,
  ReactNode,
} from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { PaletteMode } from '@mui/material'
import type {} from '@mui/lab/themeAugmentation'
import '@mui/lab/themeAugmentation'
import { set } from 'react-hook-form'

const ColorModeContext = createContext({
  toggleColorMode: () => {},
  mode: 'light',
})

export const useColorMode = () => useContext(ColorModeContext)

const AppThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const storedMode = localStorage.getItem('color-mode') as 'light' | 'dark'
    if (storedMode) {
      setMode(storedMode)
    }
  }, [])

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light'
          localStorage.setItem('color-mode', newMode)
          return newMode
        })
      },
      mode,
    }),
    [mode],
  )

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode as PaletteMode,
        },
        components: {
          MuiTimeline: {
            styleOverrides: {
              root: {
                backgroundColor: 'red',
              },
            },
          },
        },
      }),

    [mode],
  )

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default AppThemeProvider
