import React from 'react'
import { Navigate } from 'react-router-dom'
import { hasRole } from '@/lib/auth'
import { ErrorBoundary } from '../../components/ErrorBoundary'

const ManagerRoute = ({ children }: { children: React.ReactNode }) =>
  hasRole('manager') ? (
    <ErrorBoundary>{children}</ErrorBoundary>
  ) : (
    <Navigate to="/" replace />
  )

export default ManagerRoute
