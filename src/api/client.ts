import axios, { AxiosHeaders, type AxiosError, type InternalAxiosRequestConfig } from 'axios'

import type { AuthResponse, AuthTokens } from '../types/auth'
import {
  clearAuthTokens,
  getStoredAccessToken,
  getStoredRefreshToken,
  saveAuthTokens,
} from '../utils/authStorage'
import { getApiErrorMessage } from './errors'

export const API_URL = 'https://todo-router-server.onrender.com'

const apiClient = axios.create({
  baseURL: API_URL,
})

const refreshClient = axios.create({
  baseURL: API_URL,
})

let refreshPromise: Promise<AuthTokens> | null = null

const normalizeTokens = (payload: AuthResponse): AuthTokens => {
  const accessToken = payload.accessToken ?? payload.token
  const refreshToken = payload.refreshToken

  if (!accessToken || !refreshToken) {
    throw new Error('Сервер не вернул access token и refresh token')
  }

  return { accessToken, refreshToken }
}

const requestTokenRefresh = async (): Promise<AuthTokens> => {
  const refreshToken = getStoredRefreshToken()

  if (!refreshToken) {
    throw new Error('Refresh token отсутствует')
  }

  const response = await refreshClient.post<AuthResponse>('/auth/refresh', { refreshToken })
  const tokens = normalizeTokens(response.data)

  saveAuthTokens(tokens)

  return tokens
}

apiClient.interceptors.request.use((config) => {
  const token = getStoredAccessToken()

  if (token) {
    config.headers = AxiosHeaders.from(config.headers)
    config.headers.set('Authorization', `Bearer ${token}`)
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined
    const requestUrl = originalRequest?.url ?? ''
    const isAuthRequest = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register')
    const suppressGlobalError =
      isAuthRequest || requestUrl.includes('/auth/change-password')

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isAuthRequest) {
      originalRequest._retry = true

      try {
        refreshPromise ??= requestTokenRefresh().finally(() => {
          refreshPromise = null
        })

        const tokens = await refreshPromise
        originalRequest.headers = AxiosHeaders.from(originalRequest.headers)
        originalRequest.headers.set('Authorization', `Bearer ${tokens.accessToken}`)

        return apiClient(originalRequest)
      } catch (refreshError) {
        clearAuthTokens()

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('auth:logout'))
        }

        return Promise.reject(refreshError)
      }
    }

    if (typeof window !== 'undefined' && !suppressGlobalError) {
      window.dispatchEvent(
        new CustomEvent('api:error', {
          detail: getApiErrorMessage(error),
        }),
      )
    }

    return Promise.reject(error)
  },
)

export { apiClient, normalizeTokens }
