import { describe, it, expect } from 'vitest'
import { formatTemperature, formatWindSpeed, formatPercentage } from './units'

describe('formatTemperature', () => {
  it('formats celsius by default', () => {
    expect(formatTemperature(21.4, 'celsius')).toBe('21°C')
  })

  it('converts to fahrenheit', () => {
    expect(formatTemperature(0, 'fahrenheit')).toBe('32°F')
    expect(formatTemperature(100, 'fahrenheit')).toBe('212°F')
  })
})

describe('formatWindSpeed', () => {
  it('formats km/h by default', () => {
    expect(formatWindSpeed(11.2, 'kmh')).toBe('11 km/h')
  })

  it('converts to mph', () => {
    expect(formatWindSpeed(100, 'mph')).toBe('62 mph')
  })
})

describe('formatPercentage', () => {
  it('renders an em dash for null', () => {
    expect(formatPercentage(null)).toBe('—')
  })

  it('rounds to the nearest integer', () => {
    expect(formatPercentage(19.6)).toBe('20%')
  })
})
