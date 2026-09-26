import { test, expect, buildCustomer, customersList, washTypes } from './fixtures'

test.describe('Manager', () => {
  test.beforeEach(async ({ login, api }) => {
    await login('manager')
    await api.washTypes()
    await api.customersList()
  })

  test('can navigate to customers list', async ({ page }) => {
    await page.goto('/customers')
    await expect(page.getByText('John Doe').filter({ visible: true })).toBeVisible()
  })

  test('can navigate from customers list to customer detail', async ({ page, api }) => {
    await api.customer({ id: 'cust-1', name: 'John Doe' })

    await page.goto('/customers')
    await page.getByRole('row', { name: /John Doe/ }).click()

    await expect(page).toHaveURL(/\/customers\/cust-1$/)
  })

  test('can access customer edit page directly', async ({ page, api }) => {
    await api.customer({ id: 'cust-1', name: 'John Doe' })

    await page.goto('/customers/cust-1/edit')

    await expect(page.locator('input').first()).toHaveValue('John Doe')
  })
})

test('customer search is manager-only', async ({ page, login, api }) => {
  await login('salesperson')
  await api.washTypes()
  await api.customersList([])

  await page.goto('/customers/search')

  // RequireRole redirects everyone else to the home route.
  await expect(page).toHaveURL(/localhost:\d+\/$/)
})

test('manager can reach customer search', async ({ page, login, api }) => {
  await login('manager')
  await api.washTypes()
  await api.customersList([])

  await page.goto('/customers/search')

  await expect(page).toHaveURL(/\/customers\/search$/)
  await expect(page.getByPlaceholder('Search here...')).toBeVisible()
})

test.describe('Route protection', () => {
  test('login page is accessible without auth', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByText('Please log in')).toBeVisible()
  })

  test('sign up page is accessible without auth', async ({ page }) => {
    await page.goto('/sign_up')
    await expect(page).toHaveURL(/\/sign_up$/)
  })
})

// Both of these routes are React.lazy, so they exercise the Suspense boundary
// as well as the page itself.
test('wash order loads as a split chunk', async ({ page, login, api }) => {
  await login('manager')
  await api.washTypes()

  await page.goto('/wash_order')

  await expect(page.getByText('Wash & Go').filter({ visible: true }).first()).toBeVisible()
})

test('customer home loads as a split chunk', async ({ page, login, api }) => {
  await login('customer')
  await api.washTypes()
  await api.customer({ id: 'test-user-id', name: 'Ada Mokoena', total_points: 40 })

  await page.goto('/')

  await expect(page.getByText('Ada Mokoena').filter({ visible: true }).first()).toBeVisible()
})

// Each of these links went to a URL with no matching route, which renders a
// blank page instead of failing loudly.
test.describe('Links land on a real page', () => {
  test('creating a customer from an empty search opens the form', async ({ page, login, api }) => {
    await login('salesperson')
    await api.washTypes()
    await api.customersList([])

    await page.goto('/search/q?contact_number=0829999999')
    await page.getByRole('button', { name: 'Create new customer' }).first().click()

    await expect(page).toHaveURL(/\/new_customer\?contact=0829999999$/)
    await expect(page.locator('#field-contact_number')).toHaveValue('0829999999')
  })

  test('editing a system user opens the user', async ({ page, login, api }) => {
    await login('manager')
    await api.washTypes()
    const staff = buildCustomer({ id: 'staff-1', name: 'Sam Staff', roles: ['salesperson'] })
    await page.route('**/api/v1/system_users', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([staff]) })
    )
    await api.customer(staff)

    await page.goto('/settings/users')
    await page.getByRole('button', { name: 'Edit User' }).click()

    await expect(page).toHaveURL(/\/settings\/users\/staff-1\/edit$/)
    await expect(page.getByRole('heading', { name: 'Sam Staff' })).toBeVisible()
  })

  test('editing a free wash opens the wash', async ({ page, login, api }) => {
    await login('manager')
    await api.washTypes()
    await api.washType(washTypes[0])

    await page.goto('/settings')
    await page.getByRole('button', { name: 'Edit Free Wash' }).click()

    await expect(page).toHaveURL(/\/settings\/wt-1\/edit$/)
    await expect(page.locator('#field-name')).toHaveValue('Free Wash')
  })

  test('a signed-in customer visiting login lands on home', async ({ page, login, api }) => {
    await login('customer')
    await api.washTypes()
    await api.customer({ id: 'test-user-id', name: 'Ada Mokoena' })

    await page.goto('/login')

    await expect(page).toHaveURL(/localhost:\d+\/$/)
    await expect(page.getByText('Ada Mokoena').filter({ visible: true }).first()).toBeVisible()
  })
})

test('the customers report shows no money total', async ({ page, login, api }) => {
  await login('manager')
  await api.washTypes()
  await page.route('**/api/v1/reports/user_washes*', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(customersList) })
  )

  await page.goto('/customers/report')

  await expect(page.getByText('John Doe').filter({ visible: true }).first()).toBeVisible()
  await expect(page.getByText(/Total:/)).toHaveCount(0)
})
