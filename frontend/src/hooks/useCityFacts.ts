import { useQuery } from '@tanstack/react-query'
import { getCityFacts } from '@/api/locations'

/** Fetches city facts only while a target is set — the caller clears it to close the modal. */
export function useCityFacts(name: string | null, countryCode: string | null) {
  return useQuery({
    queryKey: ['locations', 'facts', name, countryCode],
    queryFn: ({ signal }) => getCityFacts(name as string, countryCode, signal),
    enabled: name !== null,
    staleTime: 5 * 60 * 1000,
  })
}
