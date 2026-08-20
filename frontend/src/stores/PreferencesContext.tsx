import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { UnitPreferences } from '@/types/weather'

interface PreferencesContextValue {
  units: UnitPreferences
  setUnits: (units: UnitPreferences) => void
}

const DEFAULT_UNITS: UnitPreferences = { temperature: 'celsius', windSpeed: 'kmh' }

const PreferencesContext = createContext<PreferencesContextValue | undefined>(undefined)

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [units, setUnits] = useState<UnitPreferences>(DEFAULT_UNITS)

  const value = useMemo(() => ({ units, setUnits }), [units])

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}

export function useUnitPreferences(): PreferencesContextValue {
  const context = useContext(PreferencesContext)
  if (!context) {
    throw new Error('useUnitPreferences must be used within a PreferencesProvider')
  }
  return context
}
