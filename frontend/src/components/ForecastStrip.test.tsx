import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/testUtils'
import { ForecastStrip } from './ForecastStrip'
import * as weatherApi from '@/api/weather'
import type { DailyForecast } from '@/types/weather'

vi.mock('@/api/weather')

function makeDay(offsetDays: number): DailyForecast {
  const date = new Date('2026-08-19T00:00:00Z')
  date.setUTCDate(date.getUTCDate() + offsetDays)
  return {
    date: date.toISOString().slice(0, 10),
    weatherCode: 1,
    condition: 'Mostly Clear',
    temperatureMax: 20,
    temperatureMin: 10,
    precipitationProbability: 15,
    sunrise: null,
    sunset: null,
    windSpeedMax: 12,
  }
}

describe('ForecastStrip', () => {
  it('renders exactly seven forecast day cards, with the first marked as Today', async () => {
    vi.mocked(weatherApi.getForecast).mockResolvedValue({
      location: { latitude: 52.2297, longitude: 21.0122, timezone: 'Europe/Warsaw' },
      days: Array.from({ length: 7 }, (_, index) => makeDay(index)),
    })

    renderWithProviders(<ForecastStrip />)

    const items = await screen.findAllByRole('listitem')
    expect(items).toHaveLength(7)
    expect(screen.getByText('Today')).toBeInTheDocument()
  })

  it('shows a retry action when the forecast request fails', async () => {
    vi.mocked(weatherApi.getForecast).mockRejectedValue(new Error('boom'))

    renderWithProviders(<ForecastStrip />)

    expect(await screen.findByRole('button', { name: /retry/i })).toBeInTheDocument()
  })
})
