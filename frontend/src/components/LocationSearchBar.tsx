import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { useLocationSearch } from '@/hooks/useLocationSearch'
import { useActiveLocation } from '@/stores/LocationContext'
import { searchResultToActiveLocation } from '@/lib/locationMapping'
import { ApiError } from '@/api/client'
import type { LocationSearchResult } from '@/types/location'

interface LocationSearchBarProps {
  /** Called when a search result is selected — used to open the city facts modal. */
  onSelectCity?: (city: LocationSearchResult) => void
}

/**
 * Always-visible search bar (no icon-toggle gate) for finding any city worldwide. Opens its
 * results dropdown on focus once there's a query, and closes on outside click, Escape, or
 * selecting a result — the same interaction shape the earlier icon-triggered search used.
 */
export function LocationSearchBar({ onSelectCity }: LocationSearchBarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { query, setQuery, data, isFetching, isError, error, isDebouncing } = useLocationSearch()
  const { setActiveLocation } = useActiveLocation()

  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  function handleSelect(result: LocationSearchResult) {
    setActiveLocation(searchResultToActiveLocation(result))
    onSelectCity?.(result)
    setQuery('')
    setIsOpen(false)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      setIsOpen(false)
      event.currentTarget.blur()
      return
    }

    if (event.key === 'Enter') {
      if (!data || data.length === 0) {
        return
      }

      event.preventDefault()

      const typed = query.trim().toLowerCase()
      const exactMatch = data.find((result) => result.name.toLowerCase() === typed)
      const result = exactMatch ?? data[0];
      if (result) handleSelect(result);
    }
  }

  const isSearching = isFetching || isDebouncing
  const showDropdown = isOpen && query.trim().length > 0

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="glass-panel flex items-center gap-2 rounded-full px-4 py-2.5">
        <Search className="size-4 shrink-0 text-ink-faint" aria-hidden="true" />
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search any city worldwide..."
          aria-label="Search for a city"
          maxLength={100}
          className="w-full bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
        />
        {isSearching && query.trim().length > 0 && (
          <Loader2 className="size-4 shrink-0 animate-spin text-ink-faint" aria-hidden="true" />
        )}
      </div>

      {showDropdown && (
        <div
          role="listbox"
          aria-label="Search results"
          className="glass-panel absolute inset-x-0 top-full z-[1100] mt-2 max-h-80 overflow-y-auto rounded-xl p-1.5"
          style={{ backgroundColor: 'rgb(255 255 255 / 0.8)' }}
        >
          {isSearching ? (
            <div className="flex items-center gap-2 px-3 py-4 text-sm text-ink-muted">
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Searching...
            </div>
          ) : isError ? (
            <div className="px-3 py-4 text-sm text-amber-600">
              {error instanceof ApiError ? error.message : 'Search failed. Try again.'}
            </div>
          ) : data && data.length > 0 ? (
            data.map((result, index) => (
              <button
                key={`${result.name}-${result.latitude}-${result.longitude}-${index}`}
                type="button"
                role="option"
                aria-selected="false"
                onClick={() => handleSelect(result)}
                className="flex w-full flex-col items-start rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-900/5"
              >
                <span className="font-medium text-ink">{result.name}</span>
                <span className="text-xs text-ink-muted">{result.country}</span>
              </button>
            ))
          ) : (
            <div className="px-3 py-4 text-sm text-ink-muted">No locations found.</div>
          )}
        </div>
      )}
    </div>
  )
}
