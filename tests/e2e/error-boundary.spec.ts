import { test, expect, washTypes } from './fixtures'

test.beforeEach(async ({ login }) => {
  await login('manager')
})

const crashWashTypes = (page) =>
  page.route('**/api/v1/wash_types', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: '{"not":"an array"}',
    })
  )

test('a render error shows a message instead of a blank page', async ({ page }) => {
  await crashWashTypes(page)
  await page.goto('/wash_types')

  await expect(page.getByText('Something went wrong')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible()
})

test('navigating away clears the error', async ({ page, api }) => {
  await crashWashTypes(page)
  await page.goto('/wash_types')
  await expect(page.getByText('Something went wrong')).toBeVisible()

  await page.unroute('**/api/v1/wash_types')
  await api.washTypes(washTypes)
  await api.customersList()
  await page.getByRole('link', { name: 'Home' }).click()

  await expect(page.getByText('Something went wrong')).toBeHidden()
})

test('a failed read shows the boundary with the API message', async ({ page }) => {
  // Reads suspend, so a rejected fetch throws to the boundary rather than
  // toasting over a skeleton that would never resolve.
  await page.route('**/api/v1/wash_types', (route) =>
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'The reports database is offline.' }),
    })
  )

  await page.goto('/wash_types')

  await expect(page.getByText('Something went wrong')).toBeVisible()
  await expect(page.getByText('The reports database is offline.')).toBeVisible()
})

test('the skeleton shows while a read is in flight', async ({ page }) => {
  await page.route('**/api/v1/wash_types', () => {})
  await page.goto('/wash_types')

  await expect(page.locator('output[aria-busy="true"]')).toHaveCount(1)
  await expect(page.getByText('Loading the wash types')).toBeAttached()
})
