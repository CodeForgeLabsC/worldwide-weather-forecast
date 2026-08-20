import { useState } from 'react'
import { BellRing, CheckCircle2 } from 'lucide-react'
import { notificationService, type NotificationPermissionState } from '@/services/NotificationService'
import { useActiveLocation } from '@/stores/LocationContext'

interface NotificationSettingsProps {
  permission: NotificationPermissionState
  onPermissionChange: (permission: NotificationPermissionState) => void
}

export function NotificationSettings({ permission, onPermissionChange }: NotificationSettingsProps) {
  const { activeLocation } = useActiveLocation()
  const [isRequesting, setIsRequesting] = useState(false)

  async function handleEnable() {
    setIsRequesting(true)
    const result = await notificationService.requestPermission()
    onPermissionChange(result)
    setIsRequesting(false)

    if (result === 'granted') {
      notificationService.showMorningForecastPreview({
        locationLabel: activeLocation.label,
        temperatureMinCelsius: 12,
        temperatureMaxCelsius: 21,
        rainExpected: true,
      })
    }
  }

  return (
    <div>
      <h2 className="text-sm font-semibold text-ink">Weather alerts</h2>
      <p className="mt-1 text-xs leading-relaxed text-ink-muted">
        Get a morning forecast notification for your active location. Scheduled delivery is
        coming soon — enabling alerts today sends a one-time preview so you know what to expect.
      </p>

      {!notificationService.isSupported() ? (
        <p className="mt-3 text-xs text-ink-faint">Notifications aren&apos;t supported in this browser.</p>
      ) : permission === 'granted' ? (
        <div className="mt-3 flex items-center gap-2 text-sm text-emerald-600">
          <CheckCircle2 className="size-4" aria-hidden="true" />
          Alerts enabled
        </div>
      ) : permission === 'denied' ? (
        <p className="mt-3 text-xs text-amber-600">
          Notifications are blocked for this site. Enable them in your browser settings to
          receive alerts.
        </p>
      ) : (
        <button
          type="button"
          onClick={handleEnable}
          disabled={isRequesting}
          className="mt-3 flex items-center gap-2 rounded-lg bg-accent-strong px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-500 disabled:opacity-60"
        >
          <BellRing className="size-4" aria-hidden="true" />
          {isRequesting ? 'Requesting…' : 'Enable Weather Alerts'}
        </button>
      )}
    </div>
  )
}
