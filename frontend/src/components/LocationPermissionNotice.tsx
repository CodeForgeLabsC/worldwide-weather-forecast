import { MapPinOff, X } from 'lucide-react'

interface LocationPermissionNoticeProps {
  onDismiss: () => void
}

export function LocationPermissionNotice({ onDismiss }: LocationPermissionNoticeProps) {
  return (
    <div
      role="status"
      className="glass-panel flex items-center gap-2 rounded-full py-2 pl-4 pr-2 text-sm text-ink-muted"
    >
      <MapPinOff className="size-4 shrink-0 text-amber-600" aria-hidden="true" />
      <span>Location access is off. Search for your city or enable location.</span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="ml-1 rounded-full p-1 text-ink-faint hover:bg-slate-900/5 hover:text-ink"
      >
        <X className="size-3.5" aria-hidden="true" />
      </button>
    </div>
  )
}
