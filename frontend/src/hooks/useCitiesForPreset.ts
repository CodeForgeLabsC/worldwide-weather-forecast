import { useQuery } from '@tanstack/react-query'
import { getCitiesForPreset } from '@/api/locations'

export function useCitiesForPreset(presetId: string | undefined) {
  return useQuery({
    queryKey: ['locations', 'preset-cities', presetId],
    queryFn: ({ signal }) => getCitiesForPreset(presetId as string, signal),
    enabled: presetId !== undefined,
    staleTime: Infinity,
  })
}
