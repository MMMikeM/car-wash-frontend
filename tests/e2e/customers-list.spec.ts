import { test, expect } from './fixtures'

test.beforeEach(async ({ login, api }) => {
  await login('manager')
  await api.washTypes()
  await api.customersList()
})

test('deletes a customer through the confirmation dialog', async ({ page, api }) => {
  const deleted = api.track('DELETE', '**/api/v1/customers/cust-1')
  await deleted.ready

  await page.goto('/customers')
  await page.getByRole('button', { name: 'Delete John Doe' }).filter({ visible: true }).click()

  await expect(page.getByText('Are you sure', { exact: false })).toBeVisible()
  await expect(page.getByText('John Doe', { exact: false }).last()).toBeVisible()

  await page.getByRole('button', { name: 'Delete', exact: true }).click()

  await expect.poll(() => deleted.calls).toHaveLength(1)
})

test('add wash goes to the new wash form for that customer', async ({ page }) => {
  await page.goto('/customers')
  await page.getByRole('button', { name: 'Add wash' }).filter({ visible: true }).first().click()

  await expect(page).toHaveURL(/\/customers\/cust-\d+\/washes\/new$/)
})
