import { test, expect } from './fixtures'

test('surfaces a failed login', async ({ page }) => {
  await page.route('**/api/v1/sign_in', (route) =>
    route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ is_success: false }) })
  )
  await page.goto('/login')
  await page.locator('input[type="text"]').fill('0821234567')
  await page.locator('input[type="password"]').fill('nope')
  await page.getByRole('button', { name: 'Login' }).click()
  await expect(page.getByRole('region', { name: 'Notifications' }).getByText('Login failed')).toBeVisible()
})

test('surfaces validation failures', async ({ page, login, api }) => {
  await login('manager')
  await api.washTypes()
  await api.customer()
  await page.goto('/customers/cust-123/edit')
  await page.locator('input').first().fill('')
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByRole('region', { name: 'Notifications' }).getByText('Check the form')).toBeVisible()
})
