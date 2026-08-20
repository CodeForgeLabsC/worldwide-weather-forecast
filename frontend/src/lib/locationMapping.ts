import type { ActiveLocation, Coordinates, LocationSearchResult, PresetLocation } from '@/types/location'
import { timezoneToLabel } from '@/utils/timezone'

export function presetToActiveLocation(preset: PresetLocation): ActiveLocation {
  return {
    latitude: preset.latitude,
    longitude: preset.longitude,
    city: preset.city,
    label: preset.label,
    country: preset.country,
    countryCode: preset.countryCode,
    timezone: preset.timezone,
    source: 'preset',
    presetId: preset.id,
  }
}

export function searchResultToActiveLocation(result: LocationSearchResult): ActiveLocation {
  return {
    latitude: result.latitude,
    longitude: result.longitude,
    city: result.name,
    label: result.name,
    country: result.country,
    countryCode: result.countryCode,
    timezone: result.timezone,
    source: 'search',
  }
}

/**
 * A city marker clicked on the map — same mapping as a search result, distinct source label.
 * Carries the origin preset id forward so the map keeps showing that country's other cities
 * (`useCitiesForPreset`) instead of clearing all dots the moment one is selected.
 */
export function cityToActiveLocation(city: LocationSearchResult, presetId: string | undefined): ActiveLocation {
  return { ...searchResultToActiveLocation(city), source: 'city', presetId }
}

/**
 * The backend has no reverse-geocoding endpoint, so a raw geolocation fix has no place name.
 * We derive a best-effort label from the browser's own IANA timezone (which is available
 * immediately, with no permission prompt) instead of leaving the label blank.
 */
export function geolocationToActiveLocation(coordinates: Coordinates, timezone: string): ActiveLocation {
  const label = timezoneToLabel(timezone)
  return {
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    city: label,
    label,
    country: '',
    countryCode: null,
    timezone,
    source: 'geolocation',
  }
}
