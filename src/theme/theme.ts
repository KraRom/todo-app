import { createGlobalStyle } from 'styled-components'

export type ThemeMode = 'light' | 'dark'

export interface AppTheme {
  mode: ThemeMode
  colors: {
    text: string
    textMuted: string
    title: string
    accent: string
    accentSoft: string
    appBackground: string
    surface: string
    surfaceStrong: string
    border: string
    borderStrong: string
    danger: string
    success: string
  }
  gradients: {
    page: string
    card: string
    accent: string
  }
  shadows: {
    panel: string
    soft: string
  }
  radii: {
    lg: string
    md: string
    sm: string
  }
}

const sharedTheme = {
  radii: {
    lg: '28px',
    md: '18px',
    sm: '12px',
  },
}

export const lightTheme: AppTheme = {
  mode: 'light',
  colors: {
    text: '#2f3a3d',
    textMuted: '#6c757d',
    title: '#17313c',
    accent: '#0f9d8a',
    accentSoft: 'rgba(15, 157, 138, 0.14)',
    appBackground: '#f3efe7',
    surface: '#fffdf9',
    surfaceStrong: '#f7f1e5',
    border: 'rgba(23, 49, 60, 0.12)',
    borderStrong: 'rgba(23, 49, 60, 0.24)',
    danger: '#c05252',
    success: '#1e7f5c',
  },
  gradients: {
    page:
      'radial-gradient(circle at top left, rgba(232, 165, 109, 0.28), transparent 28%), radial-gradient(circle at top right, rgba(15, 157, 138, 0.16), transparent 32%), linear-gradient(180deg, #f7f2e8 0%, #efe8dc 100%)',
    card: 'linear-gradient(180deg, rgba(255, 253, 249, 0.95) 0%, #fffaf1 100%)',
    accent: 'linear-gradient(135deg, #0f9d8a 0%, #e5985f 100%)',
  },
  shadows: {
    panel: '0 22px 60px rgba(78, 63, 40, 0.16)',
    soft: '0 12px 30px rgba(78, 63, 40, 0.1)',
  },
  ...sharedTheme,
}

export const darkTheme: AppTheme = {
  mode: 'dark',
  colors: {
    text: '#d7e2df',
    textMuted: '#9ab1ac',
    title: '#f4efe6',
    accent: '#4fd3be',
    accentSoft: 'rgba(79, 211, 190, 0.16)',
    appBackground: '#102026',
    surface: '#17313c',
    surfaceStrong: '#1d3f4b',
    border: 'rgba(215, 226, 223, 0.1)',
    borderStrong: 'rgba(215, 226, 223, 0.22)',
    danger: '#ff8f8f',
    success: '#67d7aa',
  },
  gradients: {
    page:
      'radial-gradient(circle at top left, rgba(229, 152, 95, 0.22), transparent 24%), radial-gradient(circle at top right, rgba(79, 211, 190, 0.16), transparent 32%), linear-gradient(180deg, #102026 0%, #0b171c 100%)',
    card: 'linear-gradient(180deg, rgba(23, 49, 60, 0.98) 0%, rgba(17, 37, 45, 0.98) 100%)',
    accent: 'linear-gradient(135deg, #4fd3be 0%, #f1a56d 100%)',
  },
  shadows: {
    panel: '0 24px 70px rgba(0, 0, 0, 0.35)',
    soft: '0 14px 35px rgba(0, 0, 0, 0.22)',
  },
  ...sharedTheme,
}

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html {
    background: ${({ theme }) => theme.colors.appBackground};
  }

  body {
    margin: 0;
    min-width: 320px;
    min-height: 100vh;
    font-family: "Trebuchet MS", "Segoe UI", sans-serif;
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.appBackground};
    background-attachment: fixed;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  button,
  input,
  textarea,
  select {
    font: inherit;
  }

  #root {
    min-height: 100vh;
  }
`
