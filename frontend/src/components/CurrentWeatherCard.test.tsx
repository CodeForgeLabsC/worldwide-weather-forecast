import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/testUtils'
import { CurrentWeatherCard } from './CurrentWeatherCard'
import * as weatherApi from '@/api/weather'

vi.mock('@/api/weather')

describe('CurrentWeatherCard', () => {
  it('renders temperature, condition, and location once data loads', async () => {
    vi.mocked(weatherApi.getCurrentWeather).mockResolvedValue({
      location: { latitude: 52.2297, longitude: 21.0122, timezone: 'Europe/Warsaw' },
      temperature: 21.4,
      apparentTemperature: 22.1,
      humidity: 64,
      windSpeed: 11.2,
      windDirection: 240,
      weatherCode: 2,
      condition: 'Partly Cloudy',
      isDay: true,
      precipitationProbability: 20,
    })

    renderWithProviders(<CurrentWeatherCard />)

    expect(await screen.findByText('Partly Cloudy')).toBeInTheDocument()
    expect(screen.getByText('21°C')).toBeInTheDocument()
    expect(screen.getByText('Warsaw, Poland')).toBeInTheDocument()
    expect(screen.getByText('Feels like 22°C')).toBeInTheDocument()
    expect(screen.getByText('64%')).toBeInTheDocument()
  })

  it('shows a retry action when the request fails', async () => {
    vi.mocked(weatherApi.getCurrentWeather).mockRejectedValue(new Error('boom'))

    renderWithProviders(<CurrentWeatherCard />)

    expect(await screen.findByRole('button', { name: /retry/i })).toBeInTheDocument()
  })
})
