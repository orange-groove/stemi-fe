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
          mode: mode,
          primary: {
            main: '#6933ff', // Purple
          },
          secondary: {
            main: '#c400d6', // pink
          },
          ...(mode === 'light'
            ? {
                background: {
                  default: '#f0f0f0', // Light grey for main background
                  paper: '#e8e8e8', // Slightly lighter grey for paper-like components
                },
                text: {
                  primary: '#000000',
                  secondary: '#555555',
                },
              }
            : {
                background: {
                  default: '#111', // Dark grey for main background
                  paper: '#222', // Slightly lighter dark grey for paper-like components
                },
                text: {
                  primary: '#ffffff',
                  secondary: '#aaaaaa',
                },
              }),
        },
        typography: {
          fontFamily: 'Roboto, Arial, sans-serif',
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
