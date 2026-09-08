import { test, expect } from './fixtures'

test.beforeEach(async ({ login, api }) => {
  await login('manager')
  await api.washTypes()
})

test('the More tab announces itself as a disclosure', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/wash_types')

  // Held across the click: opening the panel makes the background inert, so
  // the trigger drops out of the accessibility tree by design.
  const more = await page.getByRole('button', { name: 'More' }).elementHandle()
  const aria = () =>
    more!.evaluate((el) => ({
      haspopup: el.getAttribute('aria-haspopup'),
      expanded: el.getAttribute('aria-expanded'),
    }))

  expect(await aria()).toEqual({ haspopup: 'dialog', expanded: 'false' })

  await more!.click()
  await expect(page.locator('[data-slot="drawer-content"]')).toBeVisible()
  expect(await aria()).toEqual({ haspopup: 'dialog', expanded: 'true' })
})

test('a phone gets the bottom drawer', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/wash_types')
  await page.getByRole('button', { name: 'More' }).click()

  const drawer = page.locator('[data-slot="drawer-content"]')
  await expect(drawer).toBeVisible()
  await expect(page.locator('[data-slot="sheet-content"]')).toHaveCount(0)

  // Anchored to the bottom edge, full width. Polled rather than measured once:
  // the panel is still transforming in when it first becomes visible.
  await expect
    .poll(async () => {
      const box = (await drawer.boundingBox())!
      return { x: box.x, width: box.width, bottom: Math.round(box.y + box.height) }
    })
    .toEqual({ x: 0, width: 375, bottom: 812 })

  await expect(drawer.getByRole('link', { name: 'Wash Prices' })).toBeVisible()
})

test('a wide viewport gets the side sheet instead', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/wash_types')
  await page.getByRole('button', { name: 'More' }).click()

  await expect(page.locator('[data-slot="sheet-content"]')).toBeVisible()
  await expect(page.locator('[data-slot="drawer-content"]')).toHaveCount(0)
})

test('choosing a link navigates and closes the panel', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/wash_types')
  await page.getByRole('button', { name: 'More' }).click()

  await page
    .locator('[data-slot="drawer-content"]')
    .getByRole('link', { name: 'Wash Order' })
    .click()

  await expect(page).toHaveURL(/\/wash_order$/)
  await expect(page.locator('[data-slot="drawer-content"]')).toHaveCount(0)
})
