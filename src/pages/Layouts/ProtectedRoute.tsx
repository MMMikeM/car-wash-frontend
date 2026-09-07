import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { hasRole } from '@/lib/auth'

const ProtectedRoute = ({ component: Component, ...rest }) => {
  let validateUser = () => {
    if (hasRole('manager', 'salesperson')) {
      return <Component />
    } else return <Redirect to={'/'} />
  }

  return <Route {...rest}>{validateUser()}</Route>
}

export default ProtectedRoute
