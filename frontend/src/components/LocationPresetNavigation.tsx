import { usePresetLocations } from '@/hooks/usePresetLocations'
import { useActiveLocation } from '@/stores/LocationContext'
import { presetToActiveLocation } from '@/lib/locationMapping'
import { WavingFlag } from './WavingFlag'
import { cn } from '@/lib/cn'

interface LocationPresetNavigationProps {
  className?: string
  onSelect?: () => void
}

export function LocationPresetNavigation({ className, onSelect }: LocationPresetNavigationProps) {
  const { data: presets } = usePresetLocations()
  const { activeLocation, setActiveLocation } = useActiveLocation()

  if (!presets) {
    return null
  }

  return (
    <nav aria-label="Preset locations" className={cn('flex items-center gap-1', className)}>
      {presets.map((preset) => {
        const isActive = activeLocation.presetId === preset.id
        return (
          <button
            key={preset.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => {
              setActiveLocation(presetToActiveLocation(preset))
              onSelect?.()
            }}
            className={cn(
              'flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-accent-strong/10 text-accent-strong'
                : 'text-ink-muted hover:bg-slate-900/5 hover:text-ink',
            )}
          >
            <WavingFlag countryCode={preset.countryCode} className="h-3 w-4" />
            {preset.label}
          </button>
        )
      })}
    </nav>
  )
}
