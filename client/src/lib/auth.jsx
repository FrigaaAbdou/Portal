import { Navigate, useLocation } from 'react-router-dom'
import { getToken } from './api'

const useAuth = () => Boolean(getToken())

export function PrivateRoute({ children }) {
  const authed = useAuth()
  const location = useLocation()
  if (!authed) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return children
}

export function AdminRoute({ children }) {
  const authed = useAuth()
  const location = useLocation()
  const role = localStorage.getItem('role') || ''
  if (!authed) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  if (role !== 'admin') {
    return <Navigate to="/dashboard" replace />
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
