import { test, expect } from './fixtures'


const fill = async (page, label: string, value: string) => {
  await page.getByLabel(label, { exact: false }).first().fill(value)
}

test('an empty email is accepted, a malformed one is not', async ({ page }) => {
  await page.goto('/sign_up')

  await fill(page, 'Name', 'Test Person')
  await fill(page, 'Contact number', '0821234567')
  await fill(page, 'Password', 'secret123')
  await fill(page, 'Password confirmation', 'secret123')

  await fill(page, 'Email', 'not-an-email')
  await page.getByRole('button', { name: 'Sign Up' }).click()
  await expect(page.getByText('Please enter a valid email address').first()).toBeVisible()
})

test('mismatched passwords are rejected', async ({ page }) => {
  await page.goto('/sign_up')

  await fill(page, 'Name', 'Test Person')
  await fill(page, 'Contact number', '0821234567')
  await fill(page, 'Password', 'secret123')
  await fill(page, 'Password confirmation', 'different')

  await page.getByRole('button', { name: 'Sign Up' }).click()
  await expect(page.getByText('Please ensure that passwords match').first()).toBeVisible()
})

test('a contact number that is not 10 digits from 0 is rejected', async ({ page }) => {
  await page.goto('/sign_up')

  await fill(page, 'Name', 'Test Person')
  await fill(page, 'Contact number', '123')
  await fill(page, 'Password', 'secret123')
  await fill(page, 'Password confirmation', 'secret123')

  await page.getByRole('button', { name: 'Sign Up' }).click()
  await expect(page.getByText('Numbers must begin with 0').first()).toBeVisible()
})

test('a wash price must be a number, and an empty one is refused', async ({ page, login, api }) => {
  await login('manager')
  await api.washTypes()
  await page.goto('/wash_types/new')

  await fill(page, 'Name', 'Test Wash')
  await fill(page, 'Price', 'abc')
  await page.getByRole('button', { name: 'Save' }).click()

  await expect(page.getByText('Please enter a number').first()).toBeVisible()
})
