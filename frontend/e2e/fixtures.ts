import type { Page } from '@playwright/test'

export const PRESETS = [
  {
    id: 'california-us',
    label: 'California',
    city: 'Los Angeles',
    country: 'United States',
    countryCode: 'US',
    latitude: 34.0522,
    longitude: -118.2437,
    timezone: 'America/Los_Angeles',
  },
  {
    id: 'poland',
    label: 'Poland',
    city: 'Warsaw',
    country: 'Poland',
    countryCode: 'PL',
    latitude: 52.2297,
    longitude: 21.0122,
    timezone: 'Europe/Warsaw',
  },
  {
    id: 'brazil',
    label: 'Brazil',
    city: 'São Paulo',
    country: 'Brazil',
    countryCode: 'BR',
    latitude: -23.5505,
    longitude: -46.6333,
    timezone: 'America/Sao_Paulo',
  },
  {
    id: 'mexico',
    label: 'Mexico',
    city: 'Mexico City',
    country: 'Mexico',
    countryCode: 'MX',
    latitude: 19.4326,
    longitude: -99.1332,
    timezone: 'America/Mexico_City',
  },
  {
    id: 'japan',
    label: 'Japan',
    city: 'Tokyo',
    country: 'Japan',
    countryCode: 'JP',
    latitude: 35.6762,
    longitude: 139.6503,
    timezone: 'Asia/Tokyo',
  },
]

const CITIES_BY_PRESET: Record<string, Array<{ name: string; country: string; countryCode: string; latitude: number; longitude: number; timezone: string }>> = {
  poland: [
    { name: 'Warsaw', country: 'Poland', countryCode: 'PL', latitude: 52.2297, longitude: 21.0122, timezone: 'Europe/Warsaw' },
    { name: 'Oświęcim', country: 'Poland', countryCode: 'PL', latitude: 50.0343, longitude: 19.221, timezone: 'Europe/Warsaw' },
  ],
  japan: [{ name: 'Tokyo', country: 'Japan', countryCode: 'JP', latitude: 35.6762, longitude: 139.6503, timezone: 'Asia/Tokyo' }],
}

const CITY_FACTS = {
  name: 'Oświęcim',
  country: 'Poland',
  population: 34170,
  summary: 'Oświęcim is a town in the Lesser Poland Voivodeship in southern Poland.',
  thumbnailUrl: null,
  sourceUrl: 'https://en.wikipedia.org/wiki/O%C5%9Bwi%C4%99cim',
}

function currentWeatherFor(timezone: string) {
  return {
    location: { latitude: 0, longitude: 0, timezone },
    temperature: 21.4,
    apparentTemperature: 22.1,
    humidity: 64,
    windSpeed: 11.2,
    windDirection: 240,
    weatherCode: 2,
    condition: 'Partly Cloudy',
    isDay: true,
    precipitationProbability: 20,
  }
}

function forecastFor(timezone: string) {
  return {
    location: { latitude: 0, longitude: 0, timezone },
    days: Array.from({ length: 7 }, (_, index) => ({
      date: `2026-08-${(19 + index).toString().padStart(2, '0')}`,
      weatherCode: index % 2 === 0 ? 2 : 61,
      condition: index % 2 === 0 ? 'Partly Cloudy' : 'Rain',
      temperatureMax: 21 - index,
      temperatureMin: 13 - index,
      precipitationProbability: 20 + index * 5,
      sunrise: null,
      sunset: null,
      windSpeedMax: 15,
    })),
  }
}

/**
 * Intercepts every call the frontend makes to the backend API and returns deterministic
 * fixture data, so E2E runs never depend on a live backend or the live Open-Meteo API.
 */
export async function mockApi(page: Page) {
  await page.route('**/api/locations/presets', async (route) => {
    await route.fulfill({ json: PRESETS })
  })

  await page.route('**/api/weather/current**', async (route) => {
    const url = new URL(route.request().url())
    const lat = Number(url.searchParams.get('lat'))
    const timezone = timezoneForLat(lat)
    await route.fulfill({ json: currentWeatherFor(timezone) })
  })

  await page.route('**/api/weather/forecast**', async (route) => {
    const url = new URL(route.request().url())
    const lat = Number(url.searchParams.get('lat'))
    const timezone = timezoneForLat(lat)
    await route.fulfill({ json: forecastFor(timezone) })
  })

  await page.route('**/api/locations/presets/*/cities**', async (route) => {
    const presetId = new URL(route.request().url()).pathname.split('/').at(-2)
    await route.fulfill({ json: CITIES_BY_PRESET[presetId ?? ''] ?? [] })
  })

  await page.route('**/api/locations/facts**', async (route) => {
    await route.fulfill({ json: CITY_FACTS })
  })

  await page.route('**/api/locations/search**', async (route) => {
    const url = new URL(route.request().url())
    const query = url.searchParams.get('q') ?? ''
    const results = query.toLowerCase().startsWith('tokyo')
      ? [
          {
            name: 'Tokyo',
            country: 'Japan',
            countryCode: 'JP',
            latitude: 35.6762,
            longitude: 139.6503,
            timezone: 'Asia/Tokyo',
          },
        ]
      : []
    await route.fulfill({ json: results })
  })
}

function timezoneForLat(lat: number): string {
  const preset = PRESETS.find((p) => Math.abs(p.latitude - lat) < 0.01)
  return preset?.timezone ?? 'Europe/Warsaw'
}
