export interface UserProfile {
  id: number
  email: string
  age?: number
  createdAt?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResponse extends Partial<AuthTokens> {
  token?: string
  user?: UserProfile
}

export interface AuthCredentials {
  email: string
  password: string
}

export interface RegisterPayload extends AuthCredentials {
  age?: number
}

export interface ChangePasswordPayload {
  oldPassword: string
  newPassword: string
}
