import { test, expect } from './fixtures'

test.beforeEach(async ({ login, api }) => {
  await login('manager')
  await api.washTypes()
})

// Each report is a route plus a ReportPage; the route registration is the part
// nothing else covers.
const reports = [
  {
    name: 'washes',
    path: '/reports/washes',
    endpoint: 'washes_report',
    row: { name: 'Wash & Go', wash_count: 4, total_cost: 8000, total_price: 20000 },
    expected: 'Wash & Go',
  },
  {
    name: 'daily washes',
    path: '/reports/daily_washes',
    endpoint: 'washes_daily.json',
    row: { day: '2024-01-15', wash_count: 4, total_cost: 8000, total_price: 20000 },
    expected: '2024-01-15',
  },
  {
    name: 'insured washes',
    path: '/reports/insured_washes',
    endpoint: 'insurance.json',
    row: { day: '2024-01-15', wash_count: 4, total_cost: 8000, total_price: 20000 },
    expected: '2024-01-15',
  },
] as const

for (const { name, path, endpoint, row, expected } of reports) {
  test(`${name} report renders its rows`, async ({ page }) => {
    await page.route(`**/api/v1/reports/${endpoint}*`, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([row]),
      })
    )

    await page.goto(path)

    await expect(page.getByText(expected).filter({ visible: true }).first()).toBeVisible()
    await expect(page.getByLabel('Start Date')).toBeVisible()
  })
}

// The callers that pass no `transform`, or an inline one - the shape that can
// give ReportPage's loader a new identity every render.
for (const [name, path, endpoint] of [
  ['active users', '/reports/active_users', 'active_users'],
  ['users today', '/customers/report', 'user_washes'],
  ['daily wash detail', '/customers/daily_wash_list', 'washes_daily_detail'],
] as const) {
  test(`the ${name} report fetches once, not in a loop`, async ({ page }) => {
    let calls = 0
    await page.route(`**/api/v1/reports/${endpoint}*`, (route) => {
      calls++
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { day: '2024-01-15', name: 'Wash & Go', wash_count: 4, total_cost: 8000, total_price: 20000 },
        ]),
      })
    })

    await page.goto(path)
    await expect(page.locator('output[aria-busy="true"]')).toHaveCount(0)
    await page.waitForTimeout(1500)

    // Two, not one: React re-invokes effects once in development.
    expect(calls).toBeLessThanOrEqual(2)
  })
}
