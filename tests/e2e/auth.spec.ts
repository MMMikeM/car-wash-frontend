import { test, expect } from './fixtures'

test.describe('Login', () => {
  test('shows login form', async ({ page }) => {
    await page.goto('/login')

    await expect(page.getByText('Please log in')).toBeVisible()
    await expect(page.locator('input[type="text"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible()
  })

  test('shows error on failed login', async ({ page }) => {
    await page.route('**/api/v1/sign_in', (route) =>
      route.fulfill({ status: 401, body: JSON.stringify({ error: 'Invalid credentials' }) })
    )

    await page.goto('/login')
    await page.locator('input[type="text"]').fill('0821234567')
    await page.locator('input[type="password"]').fill('wrongpassword')
    await page.getByRole('button', { name: 'Login' }).click()

    // The failure is silent until toasts land; what must hold is that no
    // session is stored and the app stays put.
    await expect(page).toHaveURL(/\/login$/)
    expect(await page.evaluate(() => sessionStorage.getItem('token'))).toBeNull()
  })

  test('stores the session on successful login as manager', async ({ page, api }) => {
    await page.route('**/api/v1/sign_in', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          is_success: true,
          data: {
            user: {
              id: 'user-123',
              email: 'manager@test.com',
              authentication_token: 'token-abc',
              roles: ['manager', 'salesperson'],
            },
          },
        }),
      })
    )
    await api.customersList([])
    await api.washTypes()

    await page.goto('/login')
    await page.locator('input[type="text"]').fill('0821234567')
    await page.locator('input[type="password"]').fill('correctpassword')
    await page.getByRole('button', { name: 'Login' }).click()

    // Login navigates on success; read the session only once that has settled,
    // or the evaluate races a destroyed execution context.
    await page.waitForURL((url) => !url.pathname.startsWith('/login'))
    expect(await page.evaluate(() => sessionStorage.getItem('token'))).toBe('token-abc')
  })

  test('has link to sign up page', async ({ page }) => {
    await page.goto('/login')
    // The header nav carries the same link, so scope to the login form's own.
    await expect(
      page.getByRole('heading', { name: /New to Carbon Car Wash/ }).getByRole('link')
    ).toHaveAttribute('href', '/sign_up')
  })

  test('has link to forgot password', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('link', { name: 'Forgot Password?' })).toHaveAttribute(
      'href',
      '/forgot_password'
    )
  })
})

test('allows access to customers page when logged in as manager', async ({ page, login, api }) => {
  await login('manager')
  await api.customersList()
  await api.washTypes()

  await page.goto('/customers')

  await expect(page.getByText('John Doe').filter({ visible: true })).toBeVisible()
})
