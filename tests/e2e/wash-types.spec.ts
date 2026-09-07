import { test, expect } from './fixtures'

test.beforeEach(async ({ login, api }) => {
  await login('manager')
  await api.washTypes()
})

test('loads wash type data', async ({ page, api }) => {
  await api.washType({
    id: 'wt-2',
    name: 'Wash & Go',
    points: 10,
    price: 5000,
    cost: 2000,
    description: 'Quick wash',
    order: 1,
  })

  await page.goto('/wash_types/wt-2/edit')

  await expect(page.locator('input').first()).toHaveValue('Wash & Go')
})

test('saves wash type without the read-only fields', async ({ page, api }) => {
  await api.washType({
    id: 'wt-2',
    name: 'Wash & Go',
    points: 10,
    price: 5000,
    cost: 2000,
    description: 'Quick wash',
    order: 1,
    hidden: false,
    free: false,
    created_at: '2020-01-01',
    updated_at: '2024-01-01',
  })
  const save = api.capture('PUT', '**/api/v1/wash_types/wt-2')
  await save.ready

  await page.goto('/wash_types/wt-2/edit')
  await page.locator('input').first().fill('Wash & Go Premium')
  await page.getByRole('button', { name: 'Save' }).click()

  await expect.poll(() => save.seen.body).toBeTruthy()
  const body = save.seen.body!
  for (const field of ['name', 'cost', 'price', 'points', 'description', 'order']) {
    expect(body).toHaveProperty(field)
  }
  for (const field of ['created_at', 'updated_at', 'hidden']) {
    expect(body).not.toHaveProperty(field)
  }
})

test('saves free wash settings without the read-only fields', async ({ page, api }) => {
  await api.washType({
    id: 'wt-1',
    name: 'Free Wash',
    points: 0,
    cost: 0,
    description: 'Loyalty reward',
  })
  const save = api.capture('PUT', '**/api/v1/wash_types/wt-1')
  await save.ready

  await page.goto('/settings/wt-1/edit')
  await page.getByRole('button', { name: 'Save' }).click()

  await expect.poll(() => save.seen.body).toBeTruthy()
  for (const field of ['name', 'cost', 'points', 'description']) {
    expect(save.seen.body!).toHaveProperty(field)
  }
})
