import { useActiveLocation } from '@/stores/LocationContext'
import { useLocationClock } from '@/hooks/useLocationClock'
import { GlassPanel } from './GlassPanel'
import { WavingFlag } from './WavingFlag'

export function LocalTimeCard() {
  const { activeLocation } = useActiveLocation()
  const clock = useLocationClock(activeLocation.timezone)

  return (
    <GlassPanel
      className="relative w-full max-w-xs overflow-hidden p-4 sm:p-6"
      aria-label={`Local time in ${activeLocation.label}`}
    >
      <div
        key={activeLocation.countryCode ?? 'unknown'}
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center opacity-55 animate-[flag-drift_9s_ease-in-out_infinite,backdrop-fade-in_0.7s_ease-out]"
      >
        <WavingFlag countryCode={activeLocation.countryCode} className="h-40 w-64 -rotate-6" />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/55 to-white/85"
      />

      <div className="relative">
        <p className="font-mono text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl">
          {clock.time}
        </p>
        <p className="mt-2 text-sm text-ink-muted">{clock.weekday}</p>
        <p className="text-sm text-ink-muted">{clock.monthDay}</p>
        <p className="mt-3 text-xs uppercase tracking-[0.15em] text-ink-faint">
          {activeLocation.timezone}
        </p>
      </div>
    </GlassPanel>
  )
}
