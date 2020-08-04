import React, { useEffect, useState } from 'react'
import './css/main.css'
import './css/base.css'
import Login from './pages/Login/Login'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import CustomersIndex from './pages/Customers/index'
import CustomersEdit from './pages/Customers/edit'
import CustomersNew from './pages/Customers/new'
import CustomersSearch from './pages/Customers/search'
import CustomersShow from './pages/Customers/show'
import VehicleNew from './pages/Vehicles/new'
import WashesIndex from './pages/Washes/index'
import WashesShow from './pages/Washes/show'
import Washes from './pages/Washes/customerIndex'
import WashEdit from './pages/Washes/edit'
import WashNew from './pages/Washes/new'
import ManageUserWashes from './pages/Wash/manageUserWashes'
import ManagerRoute from './pages/Layouts/ManagerRoute'
import ProtectedRoute from './pages/Layouts/ProtectedRoute'
import Logout from './pages/Logout/Logout'

function App() {
  let [Links, setLinks] = useState([])

  let loginLink = {
    name: 'Login',
    path: '/login',
  }
  let logoutLink = {
    name: 'Logout',
    path: '/logout',
  }

  let salespersonLinks = [
    {
      name: 'Search Customers',
      path: '/customers/search',
    },
  ]

  let managerLinks = [
    {
      name: 'List Customers',
      path: '/customers',
    },
    {
      name: 'Wash Prices',
      path: '/wash_types',
    },
  ]

  useEffect(() => {
    let roles = JSON.parse(sessionStorage.getItem('roles'))
    if (roles === null) {
      roles = []
    }
    let tempLinks = [...Links]
    roles.map((role) => {
      if (role === 'salesperson') {
        tempLinks = [...tempLinks, ...salespersonLinks]
      }
      if (role === 'manager') {
        tempLinks = [...tempLinks, ...managerLinks]
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
        <ul className="d-flex flex-row align-items-center py-3 px-5 mb-0 navbar-nav">
          {Links.map((link) => {
            return (
              <li>
                <Link className="nav-item mr-3 py-2 px-2" to={link.path}>
                  {link.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="container lg-w-75 mt-5">
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
          <ProtectedRoute component={CustomersShow} path="/customers/:id" />
          <ManagerRoute component={CustomersIndex} path="/customers" />
          <ProtectedRoute component={WashNew} path="/wash_types/new" />
          <ProtectedRoute component={WashEdit} path="/wash_types/:id/edit" />
          <ProtectedRoute component={WashesShow} path="/wash_types/:id" />
          <ProtectedRoute component={WashesIndex} path="/wash_types" />
          <Route path="/">
            <Washes />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App
