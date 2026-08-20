import { apiGet } from './client'
import type { CityFacts, LocationSearchResult, PresetLocation } from '@/types/location'

export function searchLocations(query: string, signal?: AbortSignal): Promise<LocationSearchResult[]> {
  return apiGet<LocationSearchResult[]>('/api/locations/search', { q: query }, signal)
}

export function getPresetLocations(signal?: AbortSignal): Promise<PresetLocation[]> {
  return apiGet<PresetLocation[]>('/api/locations/presets', {}, signal)
}

export function getCitiesForPreset(presetId: string, signal?: AbortSignal): Promise<LocationSearchResult[]> {
  return apiGet<LocationSearchResult[]>(`/api/locations/presets/${presetId}/cities`, {}, signal)
}

export function getCityFacts(
  name: string,
  countryCode: string | null,
  signal?: AbortSignal,
): Promise<CityFacts> {
  return apiGet<CityFacts>('/api/locations/facts', { name, countryCode: countryCode ?? undefined }, signal)
}
