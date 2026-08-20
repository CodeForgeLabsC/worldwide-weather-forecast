import { useActiveLocation } from '@/stores/LocationContext'
import { useCurrentWeather } from '@/hooks/useCurrentWeather'
import { useUnitPreferences } from '@/stores/PreferencesContext'
import { GlassPanel } from './GlassPanel'
import { WeatherAnimation } from './WeatherAnimation'
import { LoadingSkeleton } from './LoadingSkeleton'
import { ErrorState } from './ErrorState'
import { formatTemperature, formatWindSpeed, formatPercentage } from '@/utils/units'
import { ApiError } from '@/api/client'
import { cn } from '@/lib/cn'

export function CurrentWeatherCard() {
  const { activeLocation } = useActiveLocation()
  const { units } = useUnitPreferences()
  const { data, isPending, isError, error, refetch, isFetching } = useCurrentWeather(activeLocation)

  return (
    <GlassPanel className="w-full max-w-sm p-6" aria-label="Current weather">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">
        {activeLocation.city}
        {activeLocation.country ? `, ${activeLocation.country}` : ''}
      </p>

      {isPending ? (
        <CurrentWeatherSkeleton />
      ) : isError ? (
        <ErrorState
          message={error instanceof ApiError ? error.message : 'Weather is currently unavailable.'}
          onRetry={() => refetch()}
        />
      ) : (
        <div className={cn('transition-opacity', isFetching && 'opacity-70')}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-6xl font-semibold tracking-tight tabular-nums">
                {formatTemperature(data.temperature, units.temperature)}
              </p>
              <p className="mt-1 text-lg text-ink-muted">{data.condition}</p>
            </div>
            <WeatherAnimation weatherCode={data.weatherCode} isDay={data.isDay} size={72} />
          </div>

          <p className="mt-3 text-sm text-ink-muted">
            Feels like {formatTemperature(data.apparentTemperature, units.temperature)}
          </p>

          <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-slate-900/8 pt-4 text-sm">
            <WeatherStat label="Humidity" value={`${data.humidity}%`} />
            <WeatherStat label="Wind" value={formatWindSpeed(data.windSpeed, units.windSpeed)} />
            <WeatherStat label="Rain" value={formatPercentage(data.precipitationProbability)} />
          </dl>
        </div>
      )}
    </GlassPanel>
  )
}

function WeatherStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-ink-faint">{label}</dt>
      <dd className="mt-0.5 font-medium tabular-nums">{value}</dd>
    </div>
  )
}

function CurrentWeatherSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <LoadingSkeleton className="h-14 w-28" />
        <LoadingSkeleton className="size-16 rounded-full" />
      </div>
      <LoadingSkeleton className="h-4 w-32" />
      <div className="grid grid-cols-3 gap-3 pt-2">
        <LoadingSkeleton className="h-8" />
        <LoadingSkeleton className="h-8" />
        <LoadingSkeleton className="h-8" />
      </div>
    </div>
  )
}
