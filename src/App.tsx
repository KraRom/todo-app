import { useEffect, useState } from 'react'
import { Alert, Snackbar } from '@mui/material'
import { Route, Routes } from 'react-router-dom'

import { GuestRoute } from './components/routing/GuestRoute'
import { ProtectedRoute } from './components/routing/ProtectedRoute'
import { fetchUserProfile, logoutUser } from './store/authSlice'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProfilePage } from './pages/ProfilePage'
import { RegisterPage } from './pages/RegisterPage'

function App() {
  const dispatch = useAppDispatch()
  const { token, user } = useAppSelector((state) => state.auth)
  const [globalError, setGlobalError] = useState('')

  useEffect(() => {
    if (token && !user) {
      void dispatch(fetchUserProfile())
    }
  }, [dispatch, token, user])

  useEffect(() => {
    const handleLogout = () => {
      dispatch(logoutUser())
    }

    const handleApiError = (event: Event) => {
      const customEvent = event as CustomEvent<string>
      setGlobalError(customEvent.detail)
    }

    window.addEventListener('auth:logout', handleLogout)
    window.addEventListener('api:error', handleApiError)

    return () => {
      window.removeEventListener('auth:logout', handleLogout)
      window.removeEventListener('api:error', handleApiError)
    }
  }, [dispatch])

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Snackbar
        open={Boolean(globalError)}
        autoHideDuration={5000}
        onClose={() => setGlobalError('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" variant="filled" onClose={() => setGlobalError('')}>
          {globalError}
        </Alert>
      </Snackbar>
    </>
  )
}

export default App
