import { test as base, expect, Page } from '@playwright/test'

export const washTypes = [
  { id: 'wt-1', name: 'Free Wash', points: 0, price: 0, cost: 0, free: true, hidden: false, order: 0 },
  { id: 'wt-2', name: 'Wash & Go', points: 10, price: 5000, cost: 2000, free: false, hidden: false, order: 1 },
  { id: 'wt-3', name: 'Wash & Dry', points: 15, price: 8000, cost: 3000, free: false, hidden: false, order: 2 },
  { id: 'wt-4', name: '24hr Rain Insurance', points: 5, price: 2000, cost: 500, free: false, hidden: false, insurance: true, order: 3 },
]

export const customersList = [
  { id: 'cust-1', name: 'John Doe', email: 'john@test.com', contact_number: '0821111111', total_points: 50, vehicles: [{ id: 'v-1', registration_number: 'ABC123GP' }] },
  { id: 'cust-2', name: 'Jane Smith', email: 'jane@test.com', contact_number: '0822222222', total_points: 120, vehicles: [{ id: 'v-2', registration_number: 'XYZ789GP' }, { id: 'v-3', registration_number: 'JKL456GP' }] },
  { id: 'cust-3', name: 'No Loyalty Programme', email: 'noloyalty@carboncarwash.co.za', contact_number: '0000000001', total_points: 10450, vehicles: [] },
]

export const buildCustomer = (overrides = {}) => ({
  id: 'cust-123',
  name: 'Test Customer',
  email: 'customer@test.com',
  contact_number: '0821234567',
  total_points: 100,
  loyalty_enabled: true,
  roles: ['customer'],
  vehicles: [
    { id: 'v-1', registration_number: 'ABC123GP' },
    { id: 'v-2', registration_number: 'XYZ789GP' },
  ],
  washes: [],
  ...overrides,
})

const json = (body: unknown, headers: Record<string, string> = {}) => ({
  status: 200,
  contentType: 'application/json',
  headers,
  body: JSON.stringify(body),
})

class Api {
  constructor(private page: Page) {}

  async washTypes(types = washTypes) {
    await this.page.route('**/api/v1/wash_types?*', (route) => route.fulfill(json(types)))
    await this.page.route('**/api/v1/wash_types', (route) => route.fulfill(json(types)))
  }

  async washType(type: Record<string, unknown>) {
    await this.page.route(`**/api/v1/wash_types/${type.id}`, (route) =>
      route.request().method() === 'GET' ? route.fulfill(json(type)) : route.fallback()
    )
  }

  async customersList(customers = customersList) {
    await this.page.route('**/api/v1/customers?*', (route) =>
      route.fulfill(json(customers, { 'X-Instance-Total': String(customers.length) }))
    )
  }

  async customer(overrides = {}) {
    const customer = buildCustomer(overrides)
    await this.page.route(`**/api/v1/customers/${customer.id}`, (route) =>
      route.request().method() === 'GET' ? route.fulfill(json(customer)) : route.fallback()
    )
    return customer
  }

  // Counts calls so a test can assert a destructive call was made, or was not.
  track(method: string, url: string, status = 200) {
    const calls: string[] = []
    const ready = this.page.route(url, (route) => {
      if (route.request().method() !== method) return route.fallback()
      calls.push(route.request().url())
      return route.fulfill({ ...json({}), status })
    })
    return { calls, ready }
  }

  // Captures the request body, so a test can assert what the app actually sends.
  capture(method: string, url: string) {
    const seen: { body?: Record<string, unknown> } = {}
    const done = this.page.route(url, async (route) => {
      if (route.request().method() !== method) return route.fallback()
      seen.body = route.request().postDataJSON()
      return route.fulfill(json(seen.body ?? {}))
    })
    return { seen, ready: done }
  }
}

type Fixtures = {
  api: Api
  login: (role?: 'manager' | 'salesperson' | 'customer') => Promise<void>
}

export const test = base.extend<Fixtures>({
  api: async ({ page }, use) => {
    await use(new Api(page))
  },
  login: async ({ page }, use) => {
    await use(async (role = 'manager') => {
      const roles =
        role === 'manager'
          ? ['manager', 'salesperson']
          : role === 'salesperson'
            ? ['salesperson']
            : ['customer']

      await page.addInitScript((seed) => {
        sessionStorage.setItem('id', 'test-user-id')
        sessionStorage.setItem('email', 'test@carboncarwash.co.za')
        sessionStorage.setItem('token', 'test-token-123')
        sessionStorage.setItem('roles', JSON.stringify(seed))
      }, roles)
    })
  },
})

export { expect }
