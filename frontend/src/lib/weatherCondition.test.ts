import { describe, it, expect } from 'vitest'
import { Sun, Moon, CloudLightning } from 'lucide-react'
import { getWeatherVisual } from './weatherCondition'

describe('getWeatherVisual', () => {
  it('maps the clear-sky code to Sun during the day and Moon at night', () => {
    expect(getWeatherVisual(0, true).icon).toBe(Sun)
    expect(getWeatherVisual(0, false).icon).toBe(Moon)
  })

  it('maps thunderstorm codes to the storm particle style', () => {
    const visual = getWeatherVisual(95, true)
    expect(visual.icon).toBe(CloudLightning)
    expect(visual.particles).toBe('storm')
  })

  it('falls back to the cloudy category for unknown codes', () => {
    expect(getWeatherVisual(9999, true).category).toBe('cloudy')
  })
})
