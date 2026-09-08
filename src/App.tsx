import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom'
import { NavPanel, NavToggle } from './components/MobileNav'
import BottomNav from './components/BottomNav'
import { Toaster } from '@/components/ui/toast'

// Each of these is the only user of a dependency worth ~14kB and ~4kB, so they
// are the two routes where splitting pays for itself.
import { pageLoaders, prefetchPages } from './pages/routes'

const lazyPages = Object.fromEntries(
  Object.entries(pageLoaders).map(([key, load]) => [key, React.lazy(load)])
) as unknown as Record<keyof typeof pageLoaders, React.ComponentType<any>>

const {
  login: Login,
  logout: Logout,
  passwordReset: PasswordReset,
  forgotPassword: ForgotPassword,
  customersIndex: CustomersIndex,
  customersEdit: CustomersEdit,
  customersNew: CustomersNew,
  customersSearch: CustomersSearch,
  customersShow: CustomersShow,
  vehicleNew: VehicleNew,
  settings: Settings,
  washesIndex: WashesIndex,
  washesShow: WashesShow,
  washEdit: WashEdit,
  washNew: WashNew,
  manageUserWashes: ManageUserWashes,
  usersReport: UsersReport,
  washesReport: WashesReport,
  dailyWashes: DailyWashes,
  insuredWashes: InsuredWashes,
  dailyWashesDetail: DailyWashesDetail,
  activeUsersReport: ActiveUsersReport,
  userEdit: UserEdit,
  userNew: UserNew,
  userIndex: UserIndex,
  adminHome: AdminHome,
  salesHome: SalesHome,
  publicHome: Public,
  signUp: SignUp,
  salesNewVehicles: SalesNewVehicles,
  searchCustomer: SearchCustomer,
  salesNew: SalesNew,
  washFreeEdit: WashFreeEdit,
  washesOrder: WashesOrder,
  customerHome: CustomerHome,
} = lazyPages
import { House, Search, Users, ChartColumn, ClipboardList } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { currentRoles } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { PageLoading } from './components/Loading'









import RequireRole from './pages/Layouts/RequireRole'
import HomeRoute from './pages/Layouts/HomeRoute'





import './css/base.css'

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
  useEffect(prefetchPages, [])

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
                  end={link.path === '/'}
                  to={link.path}
                  className={({ isActive }) =>
                    cn(
                      'rounded-md px-3 py-2 text-sm text-foreground! no-underline! transition-colors hover:bg-primary/10 hover:text-primary!',
                      isActive && 'bg-primary/10 text-primary!'
                    )
                  }
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
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route element={<RequireRole roles={['manager', 'salesperson']} />}>
            <Route path="/customers/new" element={<CustomersNew />} />
            <Route path="/customers/report" element={<UsersReport />} />
            <Route path="/customers/daily_wash_list" element={<DailyWashesDetail />} />
            <Route path="/customers/:id" element={<CustomersShow />} />
            <Route path="/customers/:id/vehicles/new" element={<VehicleNew />} />
            <Route path="/customers/:id/washes/new" element={<ManageUserWashes />} />
            <Route path="/new_customer" element={<SalesNew />} />
            <Route path="/search/q" element={<SearchCustomer />} />
            <Route path="/sales/:id/vehicles/new" element={<SalesNewVehicles />} />
            <Route path="/wash_types" element={<WashesIndex />} />
            <Route path="/wash_types/new" element={<WashNew />} />
            <Route path="/wash_types/:id" element={<WashesShow />} />
            <Route path="/wash_types/:id/edit" element={<WashEdit />} />
            <Route path="/wash_order" element={<WashesOrder />} />
          </Route>

          <Route element={<RequireRole roles={['manager']} />}>
            <Route path="/customers" element={<CustomersIndex />} />
            <Route path="/customers/search" element={<CustomersSearch />} />
            <Route path="/customers/:id/edit" element={<CustomersEdit />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/:id/edit" element={<WashFreeEdit />} />
            <Route path="/settings/users" element={<UserIndex />} />
            <Route path="/settings/users/new" element={<UserNew />} />
            <Route path="/settings/users/:id/edit" element={<UserEdit />} />
            <Route path="/reports/washes" element={<WashesReport />} />
            <Route path="/reports/daily_washes" element={<DailyWashes />} />
            <Route path="/reports/active_users" element={<ActiveUsersReport />} />
            <Route path="/reports/insured_washes" element={<InsuredWashes />} />
          </Route>

          <Route path="/:id/password_reset" element={<PasswordReset />} />
          <Route path="/forgot_password" element={<ForgotPassword />} />
          <Route path="/sign_up" element={<SignUp />} />
          <Route
            path="/"
            element={
              <HomeRoute
                manager={AdminHome}
                sales={SalesHome}
                customer={CustomerHome}
                public={Public}
              />
            }
          />
        </Routes>
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
