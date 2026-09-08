import { AxeBuilder } from '@axe-core/playwright'
import { test, expect } from './fixtures'

// Axe reports whole nodes, which are unreadable in a diff. Summarise to the
// rule plus the elements that broke it.
const scan = async (page: any) => {
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()

  return violations.flatMap((violation) =>
    violation.nodes.map((node) => ({
      rule: violation.id,
      impact: violation.impact,
      target: node.target.join(' '),
      detail: node.failureSummary?.split('\n').slice(1).join(' ').trim(),
    }))
  )
}

test.describe('public pages', () => {
  for (const [name, path] of [
    ['login', '/login'],
    ['sign up', '/sign_up'],
    ['forgot password', '/forgot_password'],
  ] as const) {
    test(name, async ({ page }) => {
      await page.goto(path)
      expect(await scan(page)).toEqual([])
    })
  }
})

test.describe('manager pages', () => {
  test.beforeEach(async ({ login, api }) => {
    await login('manager')
    await api.washTypes()
    await api.customersList()
  })

  test('customers list', async ({ page }) => {
    await page.goto('/customers')
    await expect(page.getByText('John Doe').filter({ visible: true })).toBeVisible()
    expect(await scan(page)).toEqual([])
  })

  test('customer detail', async ({ page, api }) => {
    await api.customer({ id: 'cust-1', name: 'John Doe' })
    await page.goto('/customers/cust-1')
    await expect(page.getByText('John Doe').filter({ visible: true }).first()).toBeVisible()
    expect(await scan(page)).toEqual([])
  })

  test('wash types', async ({ page }) => {
    await page.goto('/wash_types')
    await expect(page.getByText('Wash & Go').filter({ visible: true }).first()).toBeVisible()
    expect(await scan(page)).toEqual([])
  })
})
