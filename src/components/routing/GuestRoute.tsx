import type { PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'

import { useAppSelector } from '../../store/hooks'

export const GuestRoute = ({ children }: PropsWithChildren) => {
  const token = useAppSelector((state) => state.auth.token)

  if (token) {
    return <Navigate to="/" replace />
  }

  return children
}
