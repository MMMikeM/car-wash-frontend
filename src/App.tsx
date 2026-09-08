import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link, NavLink } from 'react-router-dom'
import { NavPanel, NavToggle } from './components/MobileNav'
import BottomNav from './components/BottomNav'
import { Toaster } from '@/components/ui/toast'

// Each of these is the only user of a dependency worth ~14kB and ~4kB, so they
// are the two routes where splitting pays for itself.
const WashesOrder = React.lazy(() => import('./pages/Washes/order'))
const CustomerHome = React.lazy(() => import('./pages/Customer/index'))
import { House, Search, Users, ChartColumn, ClipboardList } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { currentRoles } from '@/lib/auth'
import { PageLoading } from './components/Loading'

import Login from './pages/Auth/Login'
import Logout from './pages/Auth/Logout'
import PasswordReset from './pages/Auth/PasswordReset'
import ForgotPassword from './pages/Auth/ForgotPassword'


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

import UsersReport from './pages/Reports/Users'
import WashesReport from './pages/Reports/Washes'
import DailyWashes from './pages/Reports/DailyWashes'
import InsuredWashes from './pages/Reports/InsuredWashes'
import DailyWashesDetail from './pages/Reports/DailWashesDetail'
import ActiveUsersReport from './pages/Reports/ActiveUsers'

import ManagerRoute from './pages/Layouts/ManagerRoute'
import ProtectedRoute from './pages/Layouts/ProtectedRoute'
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

import './css/base.css'
import WashFreeEdit from './pages/Settings/edit'

const home = {
  name: 'Home',
  path: '/',
  Icon: House,
}

const signUpLink = {
  name: 'Sign Up',
  path: '/sign_up',
}
const loginLink = {
  name: 'Login',
  path: '/login',
}
const logoutLink = {
  name: 'Logout',
  path: '/logout',
}

const salespersonLinks = [
  {
    name: 'Customers Today',
    path: '/customers/report',
    Icon: ClipboardList,
  },
  {
    name: 'Daily Washes',
    path: '/customers/daily_wash_list',
    Icon: ChartColumn,
  },
]

const managerLinks = [
  {
    name: 'Search Customers',
    path: '/customers/search',
    Icon: Search,
  },
  {
    name: 'List Customers',
    path: '/customers',
    Icon: Users,
  },
  {
    name: 'Daily Wash Summary',
    path: '/reports/daily_washes',
    Icon: ChartColumn,
  },
  {
    name: 'Active Users',
    path: '/reports/active_users',
  },
  {
    name: 'Insured Washes',
    path: '/reports/insured_washes',
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

interface NavLinkItem {
  name: string
  path: string
  Icon?: LucideIcon
}

const navLinksFor = (roles: string[]): NavLinkItem[] => {
  const links: NavLinkItem[] = [home]

  for (const role of [...roles].reverse()) {
    if (role === 'manager') links.push(...managerLinks)
    if (role === 'salesperson') links.push(...salespersonLinks)
  }

  return roles.length > 0
    ? [...links, logoutLink]
    : [...links, loginLink, signUpLink]
}

function App() {
  const roles = currentRoles()
  const Links = navLinksFor(roles)
  const isStaff = roles.some(
    (role) => role === 'manager' || role === 'salesperson'
  )

  return (
    <Router>
      <div className="page-glow min-h-screen">
        <header className="sticky top-0 z-40 border-b border-primary/40 bg-[#181818]/90 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-4 gap-y-1 px-3 py-2">
            <div className="flex items-center gap-2">
              {!isStaff ? (
                <NavPanel links={Links} trigger={<NavToggle />} />
              ) : null}
              <Link to="/" className="no-underline!">
                <span className="font-heading text-xl uppercase tracking-wide text-primary">
                  Carbon Car Wash
                </span>
              </Link>
            </div>
            <nav className="ml-auto hidden lg:flex items-center justify-end gap-1">
              {(isStaff ? [] : Links).map((link, key) => (
                <NavLink
                  key={key}
                  exact={link.path === '/'}
                  to={link.path}
                  className="rounded-md px-3 py-2 text-sm text-foreground! no-underline! transition-colors hover:bg-primary/10 hover:text-primary!"
                  activeClassName="bg-primary/10 text-primary!"
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>
          </div>
        </header>
        <div
          className={`mx-auto w-full max-w-5xl px-4 flex justify-center pt-6 ${
            isStaff ? 'pb-28' : ''
          }`}
        >
        <React.Suspense fallback={<PageLoading label="Loading the page" />}>
        <Switch>
          <Route component={Login} path="/login" />
          <Route component={Logout} path="/logout" />
          <ProtectedRoute component={CustomersNew} path="/customers/new" />
          <ManagerRoute
            component={CustomersSearch}
            path="/customers/search"
          />
          <ManagerRoute
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
          <ManagerRoute component={InsuredWashes} path="/reports/insured_washes" />
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
        </React.Suspense>
        </div>
        {isStaff ? (
          <BottomNav links={Links} />
        ) : null}
        <Toaster />
      </div>
    </Router>
  )
}

export default App
