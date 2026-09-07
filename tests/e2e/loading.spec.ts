import { test, expect, customersList, washTypes } from './fixtures'

// Most of these pages used to render an empty string while fetching, so a slow
// request showed a blank screen and told assistive tech nothing. The stubs here
// never resolve, which makes the loading state the thing under test.
const hang = (page, url: string) => page.route(url, () => {})

test.beforeEach(async ({ login, api }) => {
  await login('manager')
  await api.washTypes()
})

const cases = [
  ['the customers list', '/customers', '**/api/v1/customers?*', 'Loading customers'],
  ['the wash types list', '/wash_types', '**/api/v1/wash_types', 'Loading the wash types'],
  ['a report', '/reports/washes', '**/api/v1/reports/washes_report*', 'Loading the report'],
  ['a customer', '/customers/cust-123', '**/api/v1/customers/cust-123', 'Loading the customer'],
] as const

for (const [name, path, stub, label] of cases) {
  test(`${name} shows a labelled placeholder while it loads`, async ({ page }) => {
    await hang(page, stub)
    await page.goto(path)

    // <output> is implicitly a polite live region, so the label is announced.
    const busy = page.locator('output[aria-busy="true"]')
    await expect(busy).toHaveCount(1)
    await expect(busy).toContainText(label)
    expect(await page.locator('[data-slot="skeleton"]').count()).toBeGreaterThan(0)
  })
}

test('the placeholder is replaced by the real rows once they arrive', async ({ page, api }) => {
  await api.customersList()
  await page.goto('/customers')

  await expect(page.getByText('John Doe').filter({ visible: true }).first()).toBeVisible()
  await expect(page.locator('output[aria-busy="true"]')).toHaveCount(0)
})

test('a saving form stays on screen with the button showing progress', async ({ page }) => {
  // The form used to be replaced wholesale while the request was in flight.
  await hang(page, '**/api/v1/customers')
  await page.goto('/customers/new')

  await page.getByLabel('Name', { exact: false }).first().fill('Jane Test')
  await page.getByLabel('Contact number', { exact: false }).first().fill('0821234567')
  await page.getByRole('button', { name: 'Save' }).click()

  const saving = page.getByRole('button', { name: 'Saving...' })
  await expect(saving).toBeVisible()
  await expect(saving).toBeDisabled()
  await expect(page.getByLabel('Name', { exact: false }).first()).toBeVisible()
})

test('the placeholder occupies the height the real rows will', async ({ page }) => {
  // The point of a content-shaped skeleton over a spinner: swapping one for
  // the other must not move the page.
  let release: () => void
  const arrived = new Promise<void>((resolve) => (release = resolve))
  await page.route('**/api/v1/customers?*', async (route) => {
    await arrived
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: { 'X-Instance-Total': String(customersList.length) },
      body: JSON.stringify(customersList),
    })
  })

  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/customers')

  // Wait for the placeholder to actually paint: measuring straight after goto
  // races the first render and occasionally reads the wrong box.
  const firstPlaceholderCard = page.locator('output [class*="bg-card"]').first()
  await expect(firstPlaceholderCard).toBeVisible()
  const placeholder = await firstPlaceholderCard.boundingBox()

  release!()
  // The list renders reversed, so anchor on a known record rather than
  // whichever card happens to come first.
  const realCard = page.locator('.bg-card').filter({ hasText: 'John Doe' }).first()
  await expect(realCard).toBeVisible()
  const real = await realCard.boundingBox()

  expect(Math.abs(real!.height - placeholder!.height)).toBeLessThan(4)
})

test('the wash prices keep their grid shape while loading', async ({ page, login }) => {
  // This grid used to be replaced by one generic block, which collapsed the
  // two-column layout and moved the page by hundreds of pixels on arrival.
  await login('customer')
  let release: () => void
  const arrived = new Promise<void>((resolve) => (release = resolve))
  await page.route('**/api/v1/wash_types', async (route) => {
    await arrived
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(
        washTypes.map((type) => ({ ...type, description: 'A wash description that runs to about two lines of copy on a phone.' }))
      ),
    })
  })
  await page.route('**/api/v1/customers/*', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 'test-user-id',
        name: 'Jo',
        total_points: 40,
        vehicles: [],
        washes: [],
      }),
    })
  )

  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Prices' }).click()

  const placeholderCard = page.locator('output [class*="rounded-2xl"]').first()
  await expect(placeholderCard).toBeVisible()
  const placeholder = await placeholderCard.boundingBox()
  const beforeHeight = await page.evaluate(() => document.body.scrollHeight)

  release!()
  const realCard = page.locator('article.rounded-2xl').first()
  await expect(realCard).toBeVisible()
  await expect(realCard).toContainText('Wash')
  const real = await realCard.boundingBox()
  const afterHeight = await page.evaluate(() => document.body.scrollHeight)

  // Card shape, not page height: how many wash types exist is data the
  // skeleton cannot know, so only the per-card geometry is assertable.
  expect(Math.abs(real!.height - placeholder!.height)).toBeLessThan(6)
  expect(Math.abs(real!.width - placeholder!.width)).toBeLessThan(2)
  expect(beforeHeight).toBeGreaterThan(0)
  expect(afterHeight).toBeGreaterThan(0)
})
