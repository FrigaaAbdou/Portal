import { Navigate, useLocation } from 'react-router-dom'
import { getToken } from './api'

export const useAuth = () => Boolean(getToken())

export function PrivateRoute({ children }) {
  const authed = useAuth()
  const location = useLocation()
  if (!authed) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return children
}

export function PublicOnlyRoute({ children, redirectTo = '/profile' }) {
  const authed = useAuth()
  if (authed) {
    return <Navigate to={redirectTo} replace />
  }
  return children
}
