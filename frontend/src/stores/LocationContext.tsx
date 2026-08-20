import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { ActiveLocation } from '@/types/location'
import { DEFAULT_LOCATION } from '@/lib/constants'

interface LocationContextValue {
  activeLocation: ActiveLocation
  setActiveLocation: (location: ActiveLocation) => void
}

const LocationContext = createContext<LocationContextValue | undefined>(undefined)

export function LocationProvider({ children }: { children: ReactNode }) {
  const [activeLocation, setActiveLocation] = useState<ActiveLocation>(DEFAULT_LOCATION)

  const value = useMemo(() => ({ activeLocation, setActiveLocation }), [activeLocation])

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>
}

export function useActiveLocation(): LocationContextValue {
  const context = useContext(LocationContext)
  if (!context) {
    throw new Error('useActiveLocation must be used within a LocationProvider')
  }
  return context
}
