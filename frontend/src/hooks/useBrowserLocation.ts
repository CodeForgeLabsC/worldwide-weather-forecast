import { useEffect, useState } from 'react'
import type { Coordinates } from '@/types/location'

export type BrowserLocationStatus = 'idle' | 'requesting' | 'granted' | 'denied' | 'unavailable'

interface BrowserLocationState {
  status: BrowserLocationStatus
  coordinates: Coordinates | null
}

/**
 * Requests the browser's geolocation once on mount. Never blocks initial render — callers
 * should render a sensible default location immediately and react to this hook's result
 * asynchronously.
 */
export function useBrowserLocation(): BrowserLocationState {
  const [state, setState] = useState<BrowserLocationState>({ status: 'idle', coordinates: null })

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setState({ status: 'unavailable', coordinates: null })
      return
    }

    setState({ status: 'requesting', coordinates: null })

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          status: 'granted',
          coordinates: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        })
      },
      () => {
        setState({ status: 'denied', coordinates: null })
      },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 5 * 60 * 1000 },
    )
  }, [])

  return state
}
