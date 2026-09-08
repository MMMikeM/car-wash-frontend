import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { hasRole, type Role } from '@/lib/auth'
import { ErrorBoundary } from '../../components/ErrorBoundary'

const RequireRole = ({ roles }: { roles: Role[] }) => {
  const { pathname } = useLocation()

  if (!hasRole(...roles)) return <Navigate to="/" replace />

  // The boundary outlives a navigation now that it wraps an Outlet rather than
  // one page, so it has to be told to drop a caught error on the way out.
  return (
    <ErrorBoundary resetKeys={[pathname]}>
      <Outlet />
    </ErrorBoundary>
  )
}

export default RequireRole
