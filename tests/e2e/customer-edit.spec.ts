import { test, expect } from './fixtures'

test.beforeEach(async ({ login, api }) => {
  await login('manager')
  await api.washTypes()
})

test('loads customer data into form', async ({ page, api }) => {
  await api.customer({
    name: 'Test Customer',
    email: 'test@example.com',
    contact_number: '0821234567',
    total_points: 100,
  })

  await page.goto('/customers/cust-123/edit')

  const inputs = page.locator('input')
  await expect(inputs.nth(0)).toHaveValue('Test Customer')
  await expect(inputs.nth(1)).toHaveValue('test@example.com')
  await expect(inputs.nth(2)).toHaveValue('0821234567')
  await expect(inputs.nth(3)).toHaveValue('100')
})

test('shows loyalty_enabled checkbox', async ({ page, api }) => {
  await api.customer({ loyalty_enabled: true })

  await page.goto('/customers/cust-123/edit')

  await expect(page.locator('input[type="checkbox"]')).toBeChecked()
  await expect(page.getByText('Loyalty enabled')).toBeVisible()
})

test('saves a customer without its vehicles', async ({ page, api }) => {
  // A customer with many vehicles used to push the payload past a 413.
  const vehicles = Array.from({ length: 100 }, (_, i) => ({
    id: `v-${i}`,
    registration_number: `TEST${i}GP`,
  }))
  await api.customer({
    id: 'cust-noloyalty',
    name: 'No Loyalty Programme',
    email: 'noloyalty@carboncarwash.co.za',
    contact_number: '0000000001',
    total_points: 10450,
    vehicles,
  })
  const save = api.capture('PUT', '**/api/v1/customers/cust-noloyalty')
  await save.ready

  await page.goto('/customers/cust-noloyalty/edit')
  await page.locator('input').nth(3).fill('0')
  await page.locator('input[type="checkbox"]').uncheck()
  await page.getByRole('button', { name: 'Save' }).click()

  await expect.poll(() => save.seen.body).toBeTruthy()
  const body = save.seen.body!
  for (const field of ['vehicles', 'washes', 'roles']) {
    expect(body).not.toHaveProperty(field)
  }
  for (const field of ['name', 'email', 'contact_number', 'total_points', 'loyalty_enabled']) {
    expect(body).toHaveProperty(field)
  }
})

test('can toggle loyalty_enabled off', async ({ page, api }) => {
  await api.customer({ loyalty_enabled: true })
  const save = api.capture('PUT', '**/api/v1/customers/cust-123')
  await save.ready

  await page.goto('/customers/cust-123/edit')
  await page.locator('input[type="checkbox"]').uncheck()
  await page.getByRole('button', { name: 'Save' }).click()

  await expect.poll(() => save.seen.body?.loyalty_enabled).toBe(false)
})

test('does not save when a required field is empty', async ({ page, api }) => {
  await api.customer()
  const save = api.capture('PUT', '**/api/v1/customers/cust-123')
  await save.ready

  await page.goto('/customers/cust-123/edit')
  await page.locator('input').first().fill('')
  await page.getByRole('button', { name: 'Save' }).click()

  // Validation messages are silent until toasts land, so what must hold is
  // that nothing was sent and the page did not move on.
  await expect(page).toHaveURL(/\/customers\/cust-123\/edit$/)
  expect(save.seen.body).toBeUndefined()
})

test('has Convert To User button', async ({ page, api }) => {
  await api.customer()
  await page.goto('/customers/cust-123/edit')

  await expect(page.getByRole('button', { name: 'Convert To User' })).toBeVisible()
})
