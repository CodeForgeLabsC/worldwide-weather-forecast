import { useState } from 'react'
import { CloudSun, Menu, X } from 'lucide-react'
import { LocationPresetNavigation } from './LocationPresetNavigation'
import { NotificationButton } from './NotificationButton'
import { SettingsButton } from './SettingsButton'

export function TopNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-20 p-3 sm:p-4">
      <div className="glass-panel pointer-events-auto mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full px-3 py-2 sm:px-4 sm:py-2.5">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-strong shadow-[0_2px_10px_-2px_rgb(37_99_235_/_0.55)]">
            <CloudSun className="size-4 text-white" aria-hidden="true" />
          </span>
          <span className="text-sm font-bold tracking-tight text-ink">
            G<span className="text-accent-strong">-</span>Forecast
          </span>
        </div>

        <LocationPresetNavigation className="hidden md:flex" />

        <div className="flex items-center gap-0.5">
          <NotificationButton />
          <div className="hidden sm:block">
            <SettingsButton />
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            className="flex size-9 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-slate-900/5 hover:text-ink md:hidden"
          >
            {mobileMenuOpen ? <X className="size-4" aria-hidden="true" /> : <Menu className="size-4" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="glass-panel pointer-events-auto mx-auto mt-2 max-w-6xl rounded-2xl p-3 md:hidden">
          <LocationPresetNavigation
            className="flex-wrap"
            onSelect={() => setMobileMenuOpen(false)}
          />
          <div className="mt-2 border-t border-slate-900/8 pt-2 sm:hidden">
            <SettingsButton />
          </div>
        </div>
      )}
    </header>
  )
}
