import type {
  AuthCredentials,
  AuthResponse,
  AuthTokens,
  ChangePasswordPayload,
  RegisterPayload,
  UserProfile,
} from '../types/auth'
import { apiClient, normalizeTokens } from './client'

export const register = async (payload: RegisterPayload): Promise<AuthTokens> => {
  const response = await apiClient.post<AuthResponse>('/auth/register', payload)

  return normalizeTokens(response.data)
}

export const login = async (payload: AuthCredentials): Promise<AuthTokens> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', payload)

  return normalizeTokens(response.data)
}

export const fetchProfile = async (): Promise<UserProfile> => {
  const response = await apiClient.get<UserProfile>('/auth/me')

  return response.data
}

export const changePasswordRequest = async (payload: ChangePasswordPayload): Promise<void> => {
  await apiClient.post('/auth/change-password', payload)
}
