import { useEffect, useRef, useState } from 'react'
import { Settings } from 'lucide-react'
import { useUnitPreferences } from '@/stores/PreferencesContext'
import type { TemperatureUnit, WindSpeedUnit } from '@/types/weather'
import { cn } from '@/lib/cn'

export function SettingsButton() {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { units, setUnits } = useUnitPreferences()

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

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label="Settings"
        aria-expanded={isOpen}
        className="flex size-9 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-slate-900/5 hover:text-ink"
      >
        <Settings className="size-4" aria-hidden="true" />
      </button>
      {isOpen && (
        <div className="glass-panel-solid absolute right-0 top-full z-[1100] mt-2 w-56 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-ink">Units</h2>
          <div className="mt-3 space-y-3">
            <UnitToggle
              label="Temperature"
              options={[
                { value: 'celsius', label: '°C' },
                { value: 'fahrenheit', label: '°F' },
              ]}
              value={units.temperature}
              onChange={(temperature) => setUnits({ ...units, temperature })}
            />
            <UnitToggle
              label="Wind speed"
              options={[
                { value: 'kmh', label: 'km/h' },
                { value: 'mph', label: 'mph' },
              ]}
              value={units.windSpeed}
              onChange={(windSpeed) => setUnits({ ...units, windSpeed })}
            />
          </div>
        </div>
      )}
    </div>
  )
}

interface UnitToggleProps<T extends TemperatureUnit | WindSpeedUnit> {
  label: string
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
}

function UnitToggle<T extends TemperatureUnit | WindSpeedUnit>({
  label,
  options,
  value,
  onChange,
}: UnitToggleProps<T>) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-ink-muted">{label}</span>
      <div className="flex rounded-full bg-slate-900/5 p-0.5">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={value === option.value}
            className={cn(
              'rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
              value === option.value ? 'bg-white text-ink shadow-sm' : 'text-ink-faint hover:text-ink',
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
