import React from 'react'
import { Route } from 'react-router-dom'
import { hasRole } from '@/lib/auth'

const HomeRoute = ({
  manager: Manager,
  sales: Sales,
  customer: Customer,
  public: Public,
  ...rest
}) => {
  let validateUserLevel = () => {
    if (hasRole('manager')) {
      return <Manager />
    } else if (hasRole('salesperson')) {
      return <Sales />
    } else if (hasRole('customer')) {
      return <Customer />
    } else return <Public />
  }

  return <Route {...rest}>{validateUserLevel()}</Route>
}

export default HomeRoute
