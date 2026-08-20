import { apiGet } from './client'
import type { Coordinates } from '@/types/location'
import type { CurrentWeather, Forecast } from '@/types/weather'

export function getCurrentWeather(coordinates: Coordinates, signal?: AbortSignal): Promise<CurrentWeather> {
  return apiGet<CurrentWeather>(
    '/api/weather/current',
    { lat: coordinates.latitude, lon: coordinates.longitude },
    signal,
  )
}

export function getForecast(coordinates: Coordinates, days = 7, signal?: AbortSignal): Promise<Forecast> {
  return apiGet<Forecast>(
    '/api/weather/forecast',
    { lat: coordinates.latitude, lon: coordinates.longitude, days },
    signal,
  )
}
