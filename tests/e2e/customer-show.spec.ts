import { test, expect } from './fixtures'

test.beforeEach(async ({ login, api }) => {
  await login('manager')
  await api.washTypes()
})

test('displays customer information', async ({ page, api }) => {
  await api.customer({
    name: 'John Doe',
    email: 'john@example.com',
    contact_number: '0821234567',
    total_points: 150,
  })

  await page.goto('/customers/cust-123')

  for (const text of ['John Doe', 'john@example.com', '0821234567', '150', 'ABC123GP']) {
    await expect(page.getByText(text, { exact: false }).filter({ visible: true }).first()).toBeVisible()
  }
})

test('shows "No email provided" for auto-generated emails', async ({ page, api }) => {
  await api.customer({
    email: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890@carboncarwash.co.za',
  })

  await page.goto('/customers/cust-123')

  await expect(page.getByText('No email provided')).toBeVisible()
})

test('displays wash history', async ({ page, api }) => {
  await api.customer({
    washes: [
      { id: 'w-1', wash_type_id: 'wt-2', created_at: '2024-01-15T10:30:00Z' },
      { id: 'w-2', wash_type_id: 'wt-3', created_at: '2024-01-10T14:00:00Z' },
    ],
  })

  await page.goto('/customers/cust-123')

  // Card and table layouts are both in the DOM; only one is visible at a width.
  await expect(page.getByText('Wash & Go').filter({ visible: true })).toBeVisible()
  await expect(page.getByText('Wash & Dry').filter({ visible: true })).toBeVisible()
})

test('has link to add new wash', async ({ page, api }) => {
  await api.customer()
  await page.goto('/customers/cust-123')

  await expect(page.getByRole('link', { name: 'Add wash' })).toHaveAttribute(
    'href',
    '/customers/cust-123/washes/new'
  )
})

test('has link to reset password', async ({ page, api }) => {
  await api.customer()
  await page.goto('/customers/cust-123')

  await expect(page.getByRole('link', { name: 'Reset password' })).toHaveAttribute(
    'href',
    '/cust-123/password_reset'
  )
})

test('manager can see delete wash button', async ({ page, api }) => {
  await api.customer({
    washes: [{ id: 'w-1', wash_type_id: 'wt-2', created_at: '2024-01-15T10:30:00Z' }],
  })

  await page.goto('/customers/cust-123')

  await expect(
    page.getByRole('button', { name: 'Delete Wash' }).filter({ visible: true })
  ).toBeVisible()
})

test('opens delete confirmation modal', async ({ page, api }) => {
  await api.customer({
    washes: [{ id: 'w-1', wash_type_id: 'wt-2', created_at: '2024-01-15T10:30:00Z' }],
  })

  await page.goto('/customers/cust-123')

  await page.getByRole('button', { name: 'Delete Wash' }).filter({ visible: true }).click()

  await expect(page.getByText('Are you sure', { exact: false })).toBeVisible()
})
