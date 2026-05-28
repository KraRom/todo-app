import type { AuthTokens } from '../types/auth'

const ACCESS_TOKEN_KEY = 'todo-app.access-token'
const REFRESH_TOKEN_KEY = 'todo-app.refresh-token'

const isBrowser = typeof window !== 'undefined'

export const getStoredAccessToken = (): string | null => {
  if (!isBrowser) {
    return null
  }

  return window.localStorage.getItem(ACCESS_TOKEN_KEY)
}

export const getStoredRefreshToken = (): string | null => {
  if (!isBrowser) {
    return null
  }

  return window.localStorage.getItem(REFRESH_TOKEN_KEY)
}

export const saveAuthTokens = ({ accessToken, refreshToken }: AuthTokens): void => {
  if (!isBrowser) {
    return
  }

  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

export const clearAuthTokens = (): void => {
  if (!isBrowser) {
    return
  }

  window.localStorage.removeItem(ACCESS_TOKEN_KEY)
  window.localStorage.removeItem(REFRESH_TOKEN_KEY)
}
