import { test, expect } from './fixtures'

// Each of these asserts that a failed request is surfaced, not swallowed.
test.beforeEach(async ({ login, api }) => {
  await login('manager')
  await api.washTypes()
})

const fail = (status: number, body: string, contentType = 'application/json') =>
  (route) => route.fulfill({ status, contentType, body })

test('customers list reports a server error instead of blanking', async ({ page }) => {
  await page.route('**/api/v1/customers?*', fail(500, '<html>err</html>', 'text/html'))
  await page.goto('/customers')

  await expect(page.getByText('Something went wrong')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible()
})

test('a JSON error body does not crash the customers list', async ({ page }) => {
  const crashes: string[] = []
  page.on('pageerror', (e) => crashes.push(String(e)))
  await page.route('**/api/v1/customers?*', fail(500, JSON.stringify({ error: 'boom' })))

  await page.goto('/customers')
  await expect(page.getByText('Something went wrong')).toBeVisible()
  await expect(page.getByText('boom')).toBeVisible()
  expect(crashes).toEqual([])
})

test('an expired token sends the user back to login', async ({ page }) => {
  await page.route('**/api/v1/customers?*', fail(401, JSON.stringify({ error: 'unauthorized' })))

  await page.goto('/customers')

  // The session is cleared too, but the login fixture's addInitScript re-seeds
  // sessionStorage on every navigation, so the redirect is what we assert on.
  await expect(page).toHaveURL(/\/login$/)
})

test('a failed delete is reported, not silently treated as success', async ({ page, api }) => {
  await api.customersList()
  await api.track('DELETE', '**/api/v1/customers/cust-1', 500).ready

  await page.goto('/customers')
  await page.getByRole('button', { name: 'Delete John Doe' }).filter({ visible: true }).click()
  await page.getByRole('alertdialog').getByRole('button', { name: 'Delete' }).click()

  await expect(page.getByText('Could not delete the customer').first()).toBeVisible()
  await expect(page.getByText('John Doe').filter({ visible: true }).first()).toBeVisible()
})

test('a failed wash capture can be retried rather than stranding the till', async ({ page, api }) => {
  await api.customer({ id: 'cust-123', name: 'John Doe', total_points: 10 })
  let attempts = 0
  await page.route('**/api/v1/washes', (route) => {
    if (route.request().method() !== 'POST') return route.fallback()
    attempts++
    return attempts === 1
      ? route.fulfill({ status: 500, contentType: 'application/json', body: '{}' })
      : route.fulfill({ status: 200, contentType: 'application/json', body: '{}' })
  })

  await page.goto('/customers/cust-123/washes/new')
  await page.getByRole('button', { name: 'Wash & Go' }).click()
  await page.getByRole('button', { name: 'Proceed' }).click()
  await page.getByRole('alertdialog').getByRole('button', { name: 'Accept' }).click()

  await expect(page.getByText('Could not capture the wash').first()).toBeVisible()

  // The button is usable again, and a second attempt goes through.
  await page.getByRole('button', { name: 'Proceed' }).click()
  await page.getByRole('alertdialog').getByRole('button', { name: 'Accept' }).click()

  await expect(page).toHaveURL(/\/customers\/cust-123$/)
  expect(attempts).toBe(2)
})

test('a failed report load shows an error rather than staying blank', async ({ page }) => {
  await page.route('**/api/v1/reports/washes_report*', fail(500, '{}'))
  await page.goto('/reports/washes')

  await expect(page.getByText('Something went wrong')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible()
})

test("the API's own message is shown when it sends one", async ({ page, api }) => {
  await api.customersList()
  await page.route('**/api/v1/customers/cust-1', (route) =>
    route.request().method() === 'DELETE'
      ? route.fulfill({
          status: 422,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'This customer still has washes recorded.' }),
        })
      : route.fallback()
  )

  await page.goto('/customers')
  await page
    .getByRole('button', { name: 'Delete John Doe' })
    .filter({ visible: true })
    .click()
  await page.getByRole('alertdialog').getByRole('button', { name: 'Delete' }).click()

  await expect(
    page.getByText('This customer still has washes recorded.').first()
  ).toBeVisible()
})
