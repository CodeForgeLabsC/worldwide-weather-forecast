import { describe, it, expect } from 'vitest'
import { cityToActiveLocation, searchResultToActiveLocation } from './locationMapping'
import type { LocationSearchResult } from '@/types/location'

const oswiecim: LocationSearchResult = {
  name: 'Oświęcim',
  country: 'Poland',
  countryCode: 'PL',
  latitude: 50.0343,
  longitude: 19.221,
  timezone: 'Europe/Warsaw',
}

describe('cityToActiveLocation', () => {
  it('maps a city marker the same way as a search result, but with source "city"', () => {
    const asSearchResult = searchResultToActiveLocation(oswiecim)
    const asCity = cityToActiveLocation(oswiecim, 'poland')

    expect(asCity).toEqual({ ...asSearchResult, source: 'city', presetId: 'poland' })
  })

  it('carries the origin preset id forward so the map keeps showing that country\'s cities', () => {
    const result = cityToActiveLocation(oswiecim, 'poland')
    expect(result.presetId).toBe('poland')
  })
})
