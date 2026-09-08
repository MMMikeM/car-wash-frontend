import React from 'react'
import { Navigate } from 'react-router-dom'
import { hasRole } from '@/lib/auth'
import { ErrorBoundary } from '../../components/ErrorBoundary'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) =>
  hasRole('manager', 'salesperson') ? (
    <ErrorBoundary>{children}</ErrorBoundary>
  ) : (
    <Navigate to="/" replace />
  )

export default ProtectedRoute
