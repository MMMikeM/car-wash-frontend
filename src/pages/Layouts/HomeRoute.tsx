import React from 'react'
import { hasRole } from '@/lib/auth'
import { ErrorBoundary } from '../../components/ErrorBoundary'

interface Props {
  manager: React.ComponentType
  sales: React.ComponentType
  customer: React.ComponentType
  public: React.ComponentType
}

const pick = ({ manager: Manager, sales: Sales, customer: Customer, public: Public }: Props) => {
  if (hasRole('manager')) return <Manager />
  if (hasRole('salesperson')) return <Sales />
  if (hasRole('customer')) return <Customer />
  return <Public />
}

const HomeRoute = (props: Props) => <ErrorBoundary>{pick(props)}</ErrorBoundary>

export default HomeRoute
