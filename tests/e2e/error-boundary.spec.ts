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
