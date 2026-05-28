import type { PropsWithChildren } from 'react'
import { CircularProgress } from '@mui/material'
import { Navigate } from 'react-router-dom'
import styled from 'styled-components'

import { useAppSelector } from '../../store/hooks'

const Centered = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
`

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const { token, user, status } = useAppSelector((state) => state.auth)

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (!user && status === 'loading') {
    return (
      <Centered>
        <CircularProgress />
      </Centered>
    )
  }

  return children
}
