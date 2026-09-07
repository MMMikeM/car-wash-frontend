import { test, expect } from './fixtures'

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

  // ManagerRoute redirects everyone else to the home route.
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
