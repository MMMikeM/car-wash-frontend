import { test, expect } from './fixtures'

// Visual baselines. A refactor that changes these fails the run; if the change
// was intended, regenerate with `pnpm test:e2e --update-snapshots`.
//
// Baselines are stored per platform because font rendering differs between
// them. Only darwin baselines are committed, so this spec sits out elsewhere -
// to cover another platform, generate its baselines there and drop this skip.
test.skip(
  process.platform !== 'darwin',
  'no committed screenshot baselines for this platform'
)

test.use({ viewport: { width: 375, height: 812 } })

const washType = {
  id: 'wt-2',
  name: 'Wash & Go',
  points: 10,
  price: 5000,
  cost: 2000,
  description: 'Quick exterior wash',
  order: 1,
}

test.describe('public pages', () => {
  for (const [name, path] of [
    ['login', '/login'],
    ['signup', '/sign_up'],
    ['forgot-password', '/forgot_password'],
  ] as const) {
    test(name, async ({ page }) => {
      await page.goto(path)
      // Routes are lazy; without this the shot can catch the chunk spinner.
      await expect(page.getByText('Loading the page')).toHaveCount(0)
      await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true })
    })
  }
})

test.describe('manager', () => {
  test.beforeEach(async ({ login, api }) => {
    await login('manager')
    await api.washTypes()
    await api.customersList()
  })

  test('customers list', async ({ page }) => {
    await page.goto('/customers')
    await expect(page.getByText('John Doe').filter({ visible: true })).toBeVisible()
    await expect(page).toHaveScreenshot('customers-list.png', { fullPage: true })
  })

  test('customer detail', async ({ page, api }) => {
    await api.customer({ id: 'cust-1', name: 'John Doe', total_points: 150 })
    await page.goto('/customers/cust-1')
    await expect(page.getByText('John Doe').filter({ visible: true }).first()).toBeVisible()
    await expect(page).toHaveScreenshot('customer-detail.png', { fullPage: true })
  })

  test('customer edit', async ({ page, api }) => {
    await api.customer({ id: 'cust-1', name: 'John Doe' })
    await page.goto('/customers/cust-1/edit')
    await expect(page.locator('input').first()).toHaveValue('John Doe')
    await expect(page).toHaveScreenshot('customer-edit.png', { fullPage: true })
  })

  test('customer search', async ({ page }) => {
    await page.goto('/customers/search')
    await expect(page.getByPlaceholder('Search here...')).toBeVisible()
    await expect(page).toHaveScreenshot('customer-search.png', { fullPage: true })
  })

  test('wash types list', async ({ page }) => {
    await page.goto('/wash_types')
    await expect(page.getByText('Wash & Go').filter({ visible: true }).first()).toBeVisible()
    await expect(page).toHaveScreenshot('wash-types-list.png', { fullPage: true })
  })

  test('wash type detail', async ({ page, api }) => {
    await api.washType(washType)
    await page.goto('/wash_types/wt-2')
    await expect(page).toHaveScreenshot('wash-type-detail.png', { fullPage: true })
  })

  test('wash type edit', async ({ page, api }) => {
    await api.washType(washType)
    await page.goto('/wash_types/wt-2/edit')
    await expect(page.locator('input').first()).toHaveValue('Wash & Go')
    await expect(page).toHaveScreenshot('wash-type-edit.png', { fullPage: true })
  })

  test('wash type new', async ({ page }) => {
    await page.goto('/wash_types/new')
    await expect(page).toHaveScreenshot('wash-type-new.png', { fullPage: true })
  })
})

test('add wash', async ({ page, login, api }) => {
  await login('salesperson')
  await api.washTypes()
  await api.customer({
    id: 'cust-1',
    name: 'John Doe',
    total_points: 150,
    vehicles: [{ id: 'v-1', registration_number: 'ABC123GP' }],
  })

  await page.goto('/customers/cust-1/washes/new')
  await expect(page.getByText('John Doe').filter({ visible: true }).first()).toBeVisible()
  await expect(page).toHaveScreenshot('add-wash.png', { fullPage: true })
})
