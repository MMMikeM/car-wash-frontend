import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'

import Login from './pages/Auth/Login'
import Logout from './pages/Auth/Logout'
import PasswordReset from './pages/Auth/PasswordReset'
import ForgotPassword from './pages/Auth/ForgotPassword'

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
import WashesOrder from './pages/Washes/order'

import ManageUserWashes from './pages/Wash/manageUserWashes'

import UsersReport from './pages/Reports/Users'
import WashesReport from './pages/Reports/Washes'
import DailyWashes from './pages/Reports/DailyWashes'
import InsuredWashes from './pages/Reports/InsuredWashes'
import DailyWashesDetail from './pages/Reports/DailWashesDetail'
import ActiveUsersReport from './pages/Reports/ActiveUsers'

import ManagerRoute from './pages/Layouts/ManagerRoute'
import ProtectedRoute from './pages/Layouts/ProtectedRoute'
import CustomerRoute from './pages/Layouts/CustomerRoute'
import HomeRoute from './pages/Layouts/HomeRoute'

import UserEdit from './pages/Users/edit'
import UserNew from './pages/Users/new'

import UserIndex from './pages/Users/index'
import AdminHome from './pages/Admin/index'
import SalesHome from './pages/Sales/index'

import Public from './pages/Public/index'
import SignUp from './pages/Public/new'

import SalesNewVehicles from './pages/Sales/newVehicle'
import SearchCustomer from './pages/Sales/search'
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

  let signUpLink = {
    name: 'Sign Up',
    path: '/sign_up',
  }
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
      name: 'Customers Today',
      path: '/customers/report'
    },
    {
      name: 'Daily Washes',
      path: '/customers/daily_wash_list'
    },

  ]

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
      name: 'Daily Wash Summary',
      path: '/reports/daily_washes',
    },
    {
      name: 'Active Users',
      path: '/reports/active_users',
    },
    {
      name: 'Wash Prices',
      path: '/wash_types',
    },
    {
      name: 'Wash Order',
      path: '/wash_order',
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
      tempLinks.push(signUpLink)
    }
    setLinks(tempLinks)
  }, [])

  return (
    <Router>
      <nav className="bg-1 navbar border-bottom border-primary">
        <ul className="d-flex flex-row align-items-center py-2 px-3 mb-0 navbar-nav">
          {Links.map((link, key) => {
            return (
              <li key={key}>
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
          <ProtectedRoute component={SearchCustomer} path="/search/q" />
          <ProtectedRoute
            component={SalesNewVehicles}
            path="/sales/:id/vehicles/new"
          />
          <ProtectedRoute component={UsersReport} path="/customers/report" />
          <ProtectedRoute component={DailyWashesDetail} path="/customers/daily_wash_list" />
          <ProtectedRoute component={CustomersShow} path="/customers/:id" />
          <ManagerRoute component={CustomersIndex} path="/customers" />
          <ProtectedRoute component={WashNew} path="/wash_types/new" />
          <ProtectedRoute component={WashEdit} path="/wash_types/:id/edit" />
          <ProtectedRoute component={WashesShow} path="/wash_types/:id" />
          <ProtectedRoute component={WashesOrder} path="/wash_order" />
          <ProtectedRoute component={WashesIndex} path="/wash_types" />
          <ManagerRoute component={UserNew} path="/settings/users/new" />
          <ManagerRoute component={UserEdit} path="/settings/users/:id/edit" />
          <ManagerRoute component={WashFreeEdit} path="/settings/:id/edit" />
          <ManagerRoute component={UserIndex} path="/settings/users" />
          <ManagerRoute component={Settings} path="/settings" />
          <ManagerRoute component={WashesReport} path="/reports/washes" />
          <ManagerRoute component={DailyWashes} path="/reports/daily_washes" />
          <ManagerRoute component={ActiveUsersReport} path="/reports/active_users" />
          <Route component={PasswordReset} path="/:id/password_reset" />
          <Route component={ForgotPassword} path="/forgot_password" />
          <Route component={SignUp} path="/sign_up" />
          <HomeRoute
            manager={AdminHome}
            sales={SalesHome}
            customer={CustomerHome}
            public={Public}
            path="/"
          />
        </Switch>
      </div>
    </Router>
  )
}

export default App
