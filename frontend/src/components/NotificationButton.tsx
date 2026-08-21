import { useEffect, useRef, useState } from 'react'
import { Bell, BellOff } from 'lucide-react'
import { notificationService, type NotificationPermissionState } from '@/services/NotificationService'
import { NotificationSettings } from './NotificationSettings'

export function NotificationButton() {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [permission, setPermission] = useState<NotificationPermissionState>(() =>
    notificationService.getPermissionState(),
  )

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

  const Icon = permission === 'granted' ? Bell : BellOff

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label="Weather alert settings"
        aria-expanded={isOpen}
        className="flex size-9 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-slate-900/5 hover:text-ink"
      >
        <Icon className="size-4" aria-hidden="true" />
      </button>
      {isOpen && (
        <div className="glass-panel-solid absolute right-0 top-full z-[1100] mt-2 w-80 rounded-xl p-4">
          <NotificationSettings permission={permission} onPermissionChange={setPermission} />
        </div>
      )}
    </div>
  )
}
