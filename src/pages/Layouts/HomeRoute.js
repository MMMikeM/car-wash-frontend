import React from 'react'
import { Route, Redirect } from 'react-router-dom'

const HomeRoute = ({ manager: Manager, sales: Sales, customer: Customer, ...rest }) => {
    let token = sessionStorage.getItem('token')
    let roles = JSON.parse(sessionStorage.getItem('roles'))

    let validateUserLevel = () => {
        if (token && roles.includes('manager')) {
            return <Manager />
        } else if (token && roles.includes('salesperson')) {
            return <Sales />
        } else if (token && roles.includes('customer')) {
            return <Customer />
        } else return <Customer />
    }

    return <Route {...rest}>{validateUserLevel()}</Route>
}

export default HomeRoute
