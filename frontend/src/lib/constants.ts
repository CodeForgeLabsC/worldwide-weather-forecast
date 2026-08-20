import type { ActiveLocation } from '@/types/location'

/** Shown until geolocation resolves (or if it's denied/unavailable), per the product spec. */
export const DEFAULT_LOCATION: ActiveLocation = {
  latitude: 52.2297,
  longitude: 21.0122,
  city: 'Warsaw',
  label: 'Warsaw',
  country: 'Poland',
  countryCode: 'PL',
  timezone: 'Europe/Warsaw',
  source: 'default',
  presetId: 'poland',
}

/** [lat, lng] — Leaflet's coordinate order (the opposite of the old MapLibre [lng, lat] pair). */
export const INITIAL_MAP_CENTER: [number, number] = [50.5, 15.2]
export const INITIAL_MAP_ZOOM = 3.6
export const LOCATION_FLY_TO_ZOOM = 8.5
