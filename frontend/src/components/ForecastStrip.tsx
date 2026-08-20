import { useActiveLocation } from '@/stores/LocationContext'
import { useForecast } from '@/hooks/useForecast'
import { GlassPanel } from './GlassPanel'
import { ForecastDayCard } from './ForecastDayCard'
import { LoadingSkeleton } from './LoadingSkeleton'
import { ErrorState } from './ErrorState'
import { ApiError } from '@/api/client'

export function ForecastStrip() {
  const { activeLocation } = useActiveLocation()
  const { data, isPending, isError, error, refetch } = useForecast(activeLocation, 7)

  return (
    <GlassPanel className="w-full max-w-4xl p-4" aria-label="7-day forecast">
      {isPending ? (
        <ForecastSkeleton />
      ) : isError ? (
        <ErrorState
          message={error instanceof ApiError ? error.message : 'Forecast is currently unavailable.'}
          onRetry={() => refetch()}
        />
      ) : (
        <div role="list" className="no-scrollbar flex gap-2 overflow-x-auto">
          {data.days.map((day, index) => (
            <div role="listitem" key={day.date}>
              <ForecastDayCard day={day} isToday={index === 0} />
            </div>
          ))}
        </div>
      )}
    </GlassPanel>
  )
}

function ForecastSkeleton() {
  return (
    <div aria-label="Loading forecast" className="flex gap-2 overflow-x-hidden">
      {Array.from({ length: 7 }, (_, index) => (
        <LoadingSkeleton key={index} className="h-36 w-24 shrink-0 rounded-xl" />
      ))}
    </div>
  )
}
