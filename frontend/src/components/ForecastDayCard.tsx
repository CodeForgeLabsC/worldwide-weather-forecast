import type { DailyForecast } from '@/types/weather'
import { WeatherAnimation } from './WeatherAnimation'
import { formatTemperature, formatPercentage } from '@/utils/units'
import { useUnitPreferences } from '@/stores/PreferencesContext'
import { cn } from '@/lib/cn'

interface ForecastDayCardProps {
  day: DailyForecast
  isToday?: boolean
}

export function ForecastDayCard({ day, isToday = false }: ForecastDayCardProps) {
  const { units } = useUnitPreferences()
  const label = isToday ? 'Today' : formatWeekday(day.date)
  const showRain = day.precipitationProbability !== null && day.precipitationProbability > 0

  return (
    <div
      className={cn(
        'flex w-24 shrink-0 flex-col items-center gap-2 rounded-xl px-3 py-4 text-center',
        isToday ? 'bg-accent-strong/10 ring-1 ring-accent-strong/20' : 'bg-slate-900/3',
      )}
    >
      <p
        className={cn(
          'text-xs font-semibold uppercase tracking-wide',
          isToday ? 'text-ink' : 'text-ink-muted',
        )}
      >
        {label}
      </p>
      <WeatherAnimation weatherCode={day.weatherCode} isDay size={36} />
      <div className="flex items-baseline gap-1.5 text-sm tabular-nums">
        <span className="font-semibold">{formatTemperature(day.temperatureMax, units.temperature)}</span>
        <span className="text-ink-faint">{formatTemperature(day.temperatureMin, units.temperature)}</span>
      </div>
      <p className="h-4 text-[11px] text-accent-strong">
        {showRain ? `Rain ${formatPercentage(day.precipitationProbability)}` : ''}
      </p>
    </div>
  )
}

function formatWeekday(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`)
  return date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
}
