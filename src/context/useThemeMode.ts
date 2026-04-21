import { useContext } from 'react'

import { ThemeContext, type ThemeContextValue } from './themeContextValue'

export const useThemeMode = (): ThemeContextValue => {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useThemeMode must be used inside AppThemeProvider')
  }

  return context
}
