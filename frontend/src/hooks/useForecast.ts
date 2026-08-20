import { useQuery } from '@tanstack/react-query'
import { getForecast } from '@/api/weather'
import type { Coordinates } from '@/types/location'

export function useForecast(coordinates: Coordinates, days = 7) {
  return useQuery({
    queryKey: [
      'weather',
      'forecast',
      coordinates.latitude.toFixed(3),
      coordinates.longitude.toFixed(3),
      days,
    ],
    queryFn: ({ signal }) => getForecast(coordinates, days, signal),
    staleTime: 15 * 60 * 1000,
  })
}
