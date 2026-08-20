import { useEffect, useRef, useState } from 'react'
import { useBrowserLocation, type BrowserLocationStatus } from './useBrowserLocation'
import { useActiveLocation } from '@/stores/LocationContext'
import { geolocationToActiveLocation } from '@/lib/locationMapping'

interface InitialLocationSync {
  status: BrowserLocationStatus
  showPermissionNotice: boolean
  dismissNotice: () => void
}

/**
 * Applies a successful geolocation fix to the shared active location exactly once, and only
 * if the user hasn't already picked somewhere themselves (preset/search) in the meantime.
 * Surfaces a dismissible flag for the "location access is off" notice on denial/unavailability.
 */
export function useInitialLocationSync(): InitialLocationSync {
  const { status, coordinates } = useBrowserLocation()
  const { activeLocation, setActiveLocation } = useActiveLocation()
  const appliedRef = useRef(false)
  const [noticeDismissed, setNoticeDismissed] = useState(false)

  useEffect(() => {
    if (appliedRef.current || status !== 'granted' || !coordinates) {
      return
    }

    appliedRef.current = true

    if (activeLocation.source !== 'default') {
      return
    }

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    setActiveLocation(geolocationToActiveLocation(coordinates, timezone))
  }, [status, coordinates, activeLocation.source, setActiveLocation])

  return {
    status,
    showPermissionNotice: (status === 'denied' || status === 'unavailable') && !noticeDismissed,
    dismissNotice: () => setNoticeDismissed(true),
  }
}
