import { createContext } from 'react'

import type { ThemeMode } from '../theme/theme'

export interface ThemeContextValue {
  themeMode: ThemeMode
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
