import { test, expect, type Page } from '@playwright/test'
import { mockApi } from './fixtures'

test.beforeEach(async ({ page, context }) => {
  await context.clearPermissions()
  await mockApi(page)
})

/** On narrow viewports the preset nav is collapsed behind a hamburger menu; open it first. */
async function selectPreset(page: Page, name: RegExp) {
  const menuToggle = page.getByRole('button', { name: 'Open menu' })
  if (await menuToggle.isVisible()) {
    await menuToggle.click()
  }
  await page.getByRole('button', { name }).first().click()
}

test('opens and renders the default dashboard', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('application', { name: 'World map' })).toBeVisible()
  await expect(page.getByText('G-Forecast')).toBeVisible()
  await expect(page.getByLabel('Current weather')).toBeVisible()
  await expect(page.getByLabel(/Local time/)).toBeVisible()
  await expect(page.getByLabel('7-day forecast')).toBeVisible()
})

test('shows current weather data for the default location', async ({ page }) => {
  await page.goto('/')

  const weatherCard = page.getByLabel('Current weather')
  await expect(weatherCard.getByText('Partly Cloudy')).toBeVisible()
  await expect(weatherCard.getByText('21°C')).toBeVisible()
  await expect(weatherCard.getByText('Warsaw, Poland')).toBeVisible()
})

test('renders seven forecast day cards', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByLabel('7-day forecast').getByRole('listitem')).toHaveCount(7)
  await expect(page.getByText('Today')).toBeVisible()
})

test('Japan preset switches the active location to Tokyo', async ({ page }) => {
  await page.goto('/')

  await selectPreset(page, /japan/i)

  await expect(page.getByLabel(/Local time in Japan/)).toBeVisible()
  await expect(page.getByText('Tokyo, Japan')).toBeVisible()
})

test('Poland preset switches back to Warsaw after visiting another preset', async ({ page }) => {
  await page.goto('/')

  await selectPreset(page, /japan/i)
  await expect(page.getByLabel(/Local time in Japan/)).toBeVisible()

  await selectPreset(page, /poland/i)
  await expect(page.getByLabel(/Local time in Poland/)).toBeVisible()
  await expect(page.getByText('Warsaw, Poland')).toBeVisible()
})

test('search bar is always visible and selecting a result updates the active location', async ({ page }) => {
  await page.goto('/')

  const searchInput = page.getByLabel('Search for a city')
  await expect(searchInput).toBeVisible()
  await searchInput.fill('Tokyo')

  const result = page.getByRole('option', { name: /Tokyo/ })
  await expect(result).toBeVisible()
  await result.click()

  await expect(page.getByLabel(/Local time in Tokyo/)).toBeVisible()
})

test('clicking a city dot switches location and opens the city facts modal', async ({ page }) => {
  // Reduced motion swaps the map's animated fly-to for an instant jump, and the default
  // active-location zoom is city-level — zooming the map out first (a real user gesture, via
  // the zoom control) brings the other curated Poland cities into the viewport reliably,
  // regardless of exact pixel geometry.
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')

  const zoomOut = page.locator('.leaflet-control-zoom-out')
  for (let i = 0; i < 5; i++) {
    await zoomOut.click()
  }

  await page.getByRole('button', { name: 'Oświęcim' }).click()

  await expect(page.getByLabel(/Local time in Oświęcim/)).toBeVisible()
  await expect(page.getByText('Warsaw, Poland')).not.toBeVisible()

  const modal = page.getByRole('dialog', { name: 'About Oświęcim' })
  await expect(modal).toBeVisible()
  await expect(modal.getByText('34,170 people')).toBeVisible()
  await expect(modal.getByText(/southern Poland/)).toBeVisible()

  // A real click (not Escape) on the close button — this exercises Playwright's occlusion
  // check, which catches the modal being visually painted-over by something else (e.g. the
  // map) even when it's still nominally "visible" by bounding-box/CSS alone.
  await modal.getByRole('button', { name: 'Close' }).click()
  await expect(modal).not.toBeVisible()
})

test('mobile viewport has no horizontal overflow', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByLabel('Current weather')).toBeVisible()

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  )
  expect(hasHorizontalOverflow).toBe(false)
})
