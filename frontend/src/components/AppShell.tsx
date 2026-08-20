import { Suspense, lazy, useState } from 'react'
import { TopNavigation } from './TopNavigation'
import { CurrentWeatherCard } from './CurrentWeatherCard'
import { LocalTimeCard } from './LocalTimeCard'
import { ForecastStrip } from './ForecastStrip'
import { LocationPermissionNotice } from './LocationPermissionNotice'
import { LocationSearchBar } from './LocationSearchBar'
import { CityFactsModal } from './CityFactsModal'
import { useInitialLocationSync } from '@/hooks/useInitialLocationSync'
import type { LocationSearchResult } from '@/types/location'

// Leaflet still isn't tiny; keep it out of the initial chunk so the floating UI can paint
// (and the local clock can start ticking) immediately.
const WeatherMap = lazy(() => import('./WeatherMap').then((m) => ({ default: m.WeatherMap })))

export function AppShell() {
  const { showPermissionNotice, dismissNotice } = useInitialLocationSync()
  const [factsTarget, setFactsTarget] = useState<LocationSearchResult | null>(null)

  return (
    <div className="relative flex h-dvh w-full flex-col overflow-hidden bg-surface">
      <TopNavigation />

      <div className="flex h-full w-full flex-col items-center gap-3 p-3 pt-20 sm:gap-4 sm:p-4 sm:pt-24">
        {showPermissionNotice && <LocationPermissionNotice onDismiss={dismissNotice} />}

        <div className="w-full max-w-md">
          <LocationSearchBar onSelectCity={setFactsTarget} />
        </div>

        <div className="flex w-full flex-1 flex-col items-start gap-3 overflow-y-auto sm:flex-row sm:items-start sm:justify-between sm:gap-4 sm:overflow-visible">
          <div className="w-full sm:w-auto">
            <CurrentWeatherCard />
          </div>

          <div className="glass-panel relative h-64 w-full min-w-0 shrink-0 overflow-hidden rounded-2xl sm:h-auto sm:flex-1 sm:self-stretch">
            <Suspense fallback={<div className="h-full w-full bg-surface" />}>
              <WeatherMap onSelectCity={setFactsTarget} />
            </Suspense>
          </div>

          <div className="w-full sm:w-auto">
            <LocalTimeCard />
          </div>
        </div>

        <div className="mx-auto w-full max-w-4xl">
          <ForecastStrip />
        </div>
      </div>

      <CityFactsModal target={factsTarget} onClose={() => setFactsTarget(null)} />
    </div>
  )
}
