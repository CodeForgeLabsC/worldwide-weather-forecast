import { useActiveLocation } from '@/stores/LocationContext'
import { useLocationClock } from '@/hooks/useLocationClock'
import { GlassPanel } from './GlassPanel'

export function LocalTimeCard() {
  const { activeLocation } = useActiveLocation()
  const clock = useLocationClock(activeLocation.timezone)

  return (
    <GlassPanel
      className="w-full max-w-xs p-4 sm:p-6"
      aria-label={`Local time in ${activeLocation.label}`}
    >
      <p className="font-mono text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl">
        {clock.time}
      </p>
      <p className="mt-2 text-sm text-ink-muted">{clock.weekday}</p>
      <p className="text-sm text-ink-muted">{clock.monthDay}</p>
      <p className="mt-3 text-xs uppercase tracking-[0.15em] text-ink-faint">
        {activeLocation.timezone}
      </p>
    </GlassPanel>
  )
}
