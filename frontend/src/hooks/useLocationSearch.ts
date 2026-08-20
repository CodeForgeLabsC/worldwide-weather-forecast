import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { searchLocations } from '@/api/locations'
import { useDebouncedValue } from './useDebouncedValue'

const DEBOUNCE_MS = 350

export function useLocationSearch() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebouncedValue(query.trim(), DEBOUNCE_MS)

  const searchQuery = useQuery({
    queryKey: ['locations', 'search', debouncedQuery],
    queryFn: ({ signal }) => searchLocations(debouncedQuery, signal),
    enabled: debouncedQuery.length > 0,
    staleTime: 60 * 1000,
  })

  return { query, setQuery, isDebouncing: query.trim() !== debouncedQuery, ...searchQuery }
}
