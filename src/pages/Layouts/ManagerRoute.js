import React from 'react'
import { Route, Redirect } from 'react-router-dom'

const ManagerRoute = ({ component: Component, ...rest }) => {
  let token = sessionStorage.getItem('token')
  let roles = JSON.parse(sessionStorage.getItem('roles'))
  let valid = false

  if (token && roles.includes('manager')) {
    valid = true
  }

  let result = ''

  let validateUser = () => {
    if (valid) {
      return <Component />
    } else return <Redirect to={'/'} />
  }

  return <Route {...rest}>{validateUser()}</Route>
}

export default ManagerRoute
