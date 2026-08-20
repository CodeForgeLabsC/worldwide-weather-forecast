import type { TemperatureUnit, WindSpeedUnit } from '@/types/weather'

export function celsiusToUnit(celsius: number, unit: TemperatureUnit): number {
  return unit === 'fahrenheit' ? (celsius * 9) / 5 + 32 : celsius
}

export function formatTemperature(celsius: number, unit: TemperatureUnit): string {
  const symbol = unit === 'fahrenheit' ? '°F' : '°C'
  return `${Math.round(celsiusToUnit(celsius, unit))}${symbol}`
}

export function kmhToUnit(kmh: number, unit: WindSpeedUnit): number {
  return unit === 'mph' ? kmh * 0.621371 : kmh
}

export function formatWindSpeed(kmh: number, unit: WindSpeedUnit): string {
  const symbol = unit === 'mph' ? 'mph' : 'km/h'
  return `${Math.round(kmhToUnit(kmh, unit))} ${symbol}`
}

export function formatPercentage(value: number | null): string {
  return value === null ? '—' : `${Math.round(value)}%`
}
