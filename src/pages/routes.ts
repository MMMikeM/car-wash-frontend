/**
 * Every route's module loader in one place, so the chunks can be warmed after
 * the first page settles rather than fetched at the moment someone navigates.
 * `import()` is memoised by the module registry, so a warmed chunk makes the
 * matching `lazy()` resolve without a network round trip.
 */
export const pageLoaders = {
  login: () => import('./Auth/Login'),
  logout: () => import('./Auth/Logout'),
  passwordReset: () => import('./Auth/PasswordReset'),
  forgotPassword: () => import('./Auth/ForgotPassword'),
  customersIndex: () => import('./Customers/index'),
  customersEdit: () => import('./Customers/edit'),
  customersNew: () => import('./Customers/new'),
  customersSearch: () => import('./Customers/search'),
  customersShow: () => import('./Customers/show'),
  vehicleNew: () => import('./Vehicles/new'),
  settings: () => import('./Settings/index'),
  washesIndex: () => import('./Washes/index'),
  washesShow: () => import('./Washes/show'),
  washEdit: () => import('./Washes/edit'),
  washNew: () => import('./Washes/new'),
  manageUserWashes: () => import('./Wash/manageUserWashes'),
  usersReport: () => import('./Reports/Users'),
  washesReport: () => import('./Reports/Washes'),
  dailyWashes: () => import('./Reports/DailyWashes'),
  insuredWashes: () => import('./Reports/InsuredWashes'),
  dailyWashesDetail: () => import('./Reports/DailWashesDetail'),
  activeUsersReport: () => import('./Reports/ActiveUsers'),
  userEdit: () => import('./Users/edit'),
  userNew: () => import('./Users/new'),
  userIndex: () => import('./Users/index'),
  adminHome: () => import('./Admin/index'),
  salesHome: () => import('./Sales/index'),
  publicHome: () => import('./Public/index'),
  signUp: () => import('./Public/new'),
  salesNewVehicles: () => import('./Sales/newVehicle'),
  searchCustomer: () => import('./Sales/search'),
  salesNew: () => import('./Sales/newCustomer'),
  washFreeEdit: () => import('./Settings/edit'),
  washesOrder: () => import('./Washes/order'),
  customerHome: () => import('./Customer/index'),
}

const idle = (task: () => void) => {
  const request = window.requestIdleCallback
  if (request) {
    request(task, { timeout: 3000 })
    return
  }
  window.setTimeout(task, 300)
}

/**
 * Warms every remaining route chunk, so navigating does not wait on a network
 * round trip. Held until the window `load` event: requestIdleCallback alone
 * fires within tens of milliseconds and would race the first page's own
 * requests rather than following them.
 */
export const prefetchPages = () => {
  const loaders = Object.values(pageLoaders)
  let index = 0

  const warmNext = () => {
    if (index >= loaders.length) return
    // One at a time, so a burst of thirty-odd requests cannot crowd out
    // whatever the current page is fetching.
    loaders[index++]()
      .catch(() => {})
      .then(() => idle(warmNext))
  }

  const start = () => idle(warmNext)

  if (document.readyState === 'complete') {
    start()
    return
  }
  window.addEventListener('load', start, { once: true })
}
