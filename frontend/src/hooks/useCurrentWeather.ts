import { useQuery } from '@tanstack/react-query'
import { getCurrentWeather } from '@/api/weather'
import type { Coordinates } from '@/types/location'

export function useCurrentWeather(coordinates: Coordinates) {
  return useQuery({
    queryKey: [
      'weather',
      'current',
      coordinates.latitude.toFixed(3),
      coordinates.longitude.toFixed(3),
    ],
    queryFn: ({ signal }) => getCurrentWeather(coordinates, signal),
    staleTime: 5 * 60 * 1000,
  })
}
