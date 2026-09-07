import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { hasRole } from '@/lib/auth'

const ManagerRoute = ({ component: Component, ...rest }) => {
  let validateUser = () => {
    if (hasRole('manager')) {
      return <Component />
    } else return <Redirect to={'/'} />
  }

  return <Route {...rest}>{validateUser()}</Route>
}

export default ManagerRoute
