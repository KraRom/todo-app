import { useEffect, useState, type PropsWithChildren } from 'react'
import { CssBaseline } from '@mui/material'
import {
  StyledEngineProvider,
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from '@mui/material/styles'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'

import { darkTheme, GlobalStyle, lightTheme, type ThemeMode } from '../theme/theme'
import { getStoredTheme, saveTheme } from '../utils/localStorage'
import { ThemeContext } from './themeContextValue'

export const AppThemeProvider = ({ children }: PropsWithChildren) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => getStoredTheme())

  useEffect(() => {
    saveTheme(themeMode)
  }, [themeMode])

  const toggleTheme = () => {
    setThemeMode((currentMode) => (currentMode === 'light' ? 'dark' : 'light'))
  }

  const selectedTheme = themeMode === 'light' ? lightTheme : darkTheme
  const muiTheme = createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: selectedTheme.colors.accent,
      },
      background: {
        default: selectedTheme.colors.appBackground,
        paper: selectedTheme.colors.surface,
      },
      text: {
        primary: selectedTheme.colors.text,
        secondary: selectedTheme.colors.textMuted,
      },
      success: {
        main: selectedTheme.colors.success,
      },
      error: {
        main: selectedTheme.colors.danger,
      },
    },
    typography: {
      fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
      h1: {
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontWeight: 700,
      },
      h2: {
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontWeight: 700,
      },
      button: {
        textTransform: 'none',
        fontWeight: 700,
      },
    },
    shape: {
      borderRadius: 14,
    },
  })

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <StyledEngineProvider injectFirst>
        <MuiThemeProvider theme={muiTheme}>
          <StyledThemeProvider theme={selectedTheme}>
            <CssBaseline />
            <GlobalStyle />
            {children}
          </StyledThemeProvider>
        </MuiThemeProvider>
      </StyledEngineProvider>
    </ThemeContext.Provider>
  )
}
