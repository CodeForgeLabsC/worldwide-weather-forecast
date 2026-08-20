import { useQuery } from '@tanstack/react-query'
import { getPresetLocations } from '@/api/locations'

export function usePresetLocations() {
  return useQuery({
    queryKey: ['locations', 'presets'],
    queryFn: ({ signal }) => getPresetLocations(signal),
    staleTime: Infinity,
  })
}
