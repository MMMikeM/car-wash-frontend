import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'

import Login from './pages/Login/Login'
import Logout from './pages/Logout/Logout'

import CustomerHome from './pages/Customer/index'

import CustomersIndex from './pages/Customers/index'
import CustomersEdit from './pages/Customers/edit'
import CustomersNew from './pages/Customers/new'
import CustomersSearch from './pages/Customers/search'
import CustomersShow from './pages/Customers/show'

import VehicleNew from './pages/Vehicles/new'

import Settings from './pages/Settings/index'

import WashesIndex from './pages/Washes/index'
import WashesShow from './pages/Washes/show'
import WashEdit from './pages/Washes/edit'
import WashNew from './pages/Washes/new'

import ManageUserWashes from './pages/Wash/manageUserWashes'

import WashesReport from './pages/Reports/Washes'

import ManagerRoute from './pages/Layouts/ManagerRoute'
import ProtectedRoute from './pages/Layouts/ProtectedRoute'
import CustomerRoute from './pages/Layouts/CustomerRoute'
import HomeRoute from './pages/Layouts/HomeRoute'

import UserEdit from './pages/Users/edit'

import UserIndex from './pages/Users/index'
import AdminHome from './pages/Admin/index'
import SalesHome from './pages/Sales/index'

import SearchNum from './pages/Sales/searchNumber'
import SearchReg from './pages/Sales/searchRegistration'
import SalesNew from './pages/Sales/newCustomer'

import './css/main.css'
import './css/base.css'
import WashFreeEdit from './pages/Settings/edit'

function App() {
  let [Links, setLinks] = useState([])

  let home = {
    name: 'Home',
    path: '/',
  }

  let loginLink = {
    name: 'Login',
    path: '/login',
  }
  let logoutLink = {
    name: 'Logout',
    path: '/logout',
  }

  let salespersonLinks = []

  let managerLinks = [
    {
      name: 'Search Customers',
      path: '/customers/search',
    },
    {
      name: 'List Customers',
      path: '/customers',
    },
    {
      name: 'Wash Prices',
      path: '/wash_types',
    },
    {
      name: 'Washes Report',
      path: '/reports/washes',
    },
    {
      name: 'Users',
      path: '/settings/users',
    },
    {
      name: 'Settings',
      path: '/settings',
    },
  ]

  useEffect(() => {
    let roles = JSON.parse(sessionStorage.getItem('roles'))
    if (roles === null) {
      roles = []
    }
    let tempLinks = [...Links]
    tempLinks.push(home)
    roles.reverse().map((role) => {
      if (role === 'manager') {
        tempLinks = [...tempLinks, ...managerLinks]
      }
      if (role === 'salesperson') {
        tempLinks = [...tempLinks, ...salespersonLinks]
      }
    })

    if (roles.length > 0) {
      tempLinks.push(logoutLink)
    } else {
      tempLinks.push(loginLink)
    }
    setLinks(tempLinks)
  }, [])

  return (
    <Router>
      <nav className="bg-1 navbar border-bottom border-primary">
        <ul className="d-flex flex-row align-items-center py-2 px-5 mb-0 navbar-nav">
          {Links.map((link) => {
            return (
              <li>
                <Link
                  className="nav-item mr-3 py-2 px-2 text-9 font-weight-normal text-decoration-none"
                  to={link.path}
                >
                  {link.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="container-sm mt-4 d-flex justify-content-center">
        <Switch>
          <Route component={Login} path="/login" />
          <Route component={Logout} path="/logout" />
          <ProtectedRoute component={CustomersNew} path="/customers/new" />
          <ProtectedRoute
            component={CustomersSearch}
            path="/customers/search"
          />
          <ProtectedRoute
            component={CustomersEdit}
            path="/customers/:id/edit"
          />
          <ProtectedRoute
            component={VehicleNew}
            path="/customers/:id/vehicles/new"
          />
          <ProtectedRoute
            component={ManageUserWashes}
            path="/customers/:id/washes/new"
          />
          <ProtectedRoute component={SalesNew} path="/new_customer/" />
          <ProtectedRoute component={SearchReg} path="/search/q" />
          <ProtectedRoute
            component={SearchNum}
            path="/search/:registrationNumber/"
          />
          <ProtectedRoute component={CustomersShow} path="/customers/:id" />
          <ManagerRoute component={CustomersIndex} path="/customers" />
          <ProtectedRoute component={WashNew} path="/wash_types/new" />
          <ProtectedRoute component={WashEdit} path="/wash_types/:id/edit" />
          <ProtectedRoute component={WashesShow} path="/wash_types/:id" />
          <ProtectedRoute component={WashesIndex} path="/wash_types" />
          <ManagerRoute component={UserEdit} path="/settings/users/:id/edit" />
          <ManagerRoute component={WashFreeEdit} path="/settings/:id/edit" />
          <ManagerRoute component={UserIndex} path="/settings/users" />
          <ManagerRoute component={Settings} path="/settings" />
          <Route path="/reports/washes">
            <WashesReport />
          </Route>
          <HomeRoute
            manager={AdminHome}
            sales={SalesHome}
            customer={CustomerHome}
            path="/"
          />
        </Switch>
      </div>
    </Router>
  )
}

export default App
