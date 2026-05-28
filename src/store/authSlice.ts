import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { changePasswordRequest, fetchProfile, login, register } from '../api/auth'
import { getApiErrorMessage } from '../api/errors'
import type {
  AuthCredentials,
  ChangePasswordPayload,
  RegisterPayload,
  UserProfile,
} from '../types/auth'
import {
  clearAuthTokens,
  getStoredAccessToken,
  saveAuthTokens,
} from '../utils/authStorage'

export interface AuthState {
  user: UserProfile | null
  token: string | null
  status: 'idle' | 'loading' | 'failed'
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: getStoredAccessToken(),
  status: getStoredAccessToken() ? 'loading' : 'idle',
  error: null,
}

export const registerUser = createAsyncThunk<
  string,
  RegisterPayload,
  { rejectValue: string }
>('auth/registerUser', async (payload, { rejectWithValue }) => {
  try {
    const tokens = await register(payload)
    saveAuthTokens(tokens)

    return tokens.accessToken
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error))
  }
})

export const loginUser = createAsyncThunk<
  string,
  AuthCredentials,
  { rejectValue: string }
>('auth/loginUser', async (payload, { rejectWithValue }) => {
  try {
    const tokens = await login(payload)
    saveAuthTokens(tokens)

    return tokens.accessToken
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error))
  }
})

export const fetchUserProfile = createAsyncThunk<
  UserProfile,
  void,
  { rejectValue: string }
>('auth/fetchUserProfile', async (_, { rejectWithValue }) => {
  try {
    return await fetchProfile()
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error))
  }
})

export const changePassword = createAsyncThunk<
  void,
  ChangePasswordPayload,
  { rejectValue: string }
>('auth/changePassword', async (payload, { rejectWithValue }) => {
  try {
    await changePasswordRequest(payload)
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error))
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null
      state.token = null
      state.status = 'idle'
      state.error = null
      clearAuthTokens()
    },
    clearAuthError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'idle'
        state.token = action.payload
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'Не удалось зарегистрироваться'
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'idle'
        state.token = action.payload
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'Не удалось войти'
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = 'idle'
        state.user = action.payload
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = 'failed'
        state.user = null
        state.error = action.payload ?? 'Не удалось загрузить профиль'
      })
      .addCase(changePassword.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.status = 'idle'
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'Не удалось изменить пароль'
      })
  },
})

export const { clearAuthError, logoutUser } = authSlice.actions

export default authSlice.reducer
