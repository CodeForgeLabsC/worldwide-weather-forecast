export interface Coordinates {
  latitude: number
  longitude: number
}

export interface LocationSearchResult extends Coordinates {
  name: string
  country: string
  countryCode: string
  timezone: string
  population?: number | null
}

export interface PresetLocation extends Coordinates {
  id: string
  label: string
  city: string
  country: string
  countryCode: string
  timezone: string
}

/** A curated city belonging to a preset's country — same shape the search API returns. */
export type PresetCity = LocationSearchResult

export interface CityFacts {
  name: string
  country: string | null
  population: number | null
  summary: string | null
  thumbnailUrl: string | null
  sourceUrl: string | null
}

export type LocationSource = 'geolocation' | 'preset' | 'search' | 'default' | 'city'

/**
 * The unified shape driving the map, weather panel, and clock, regardless of whether the
 * location came from a preset, a search result, or the browser's geolocation API.
 */
export interface ActiveLocation extends Coordinates {
  label: string
  city: string
  country: string
  countryCode: string | null
  timezone: string
  source: LocationSource
  presetId?: string
}
