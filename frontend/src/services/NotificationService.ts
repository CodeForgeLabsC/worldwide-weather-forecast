export type NotificationPermissionState = 'default' | 'granted' | 'denied' | 'unsupported'

export interface MorningForecastPayload {
  locationLabel: string
  temperatureMinCelsius: number
  temperatureMaxCelsius: number
  rainExpected: boolean
}

/**
 * Thin abstraction over the browser Notification API. Keeps the rest of the app from
 * depending on the global `Notification` object directly, and gives future push-based
 * delivery a single seam to plug into.
 *
 * Scope note: this service can request permission and fire a notification immediately
 * (e.g. a confirmation toast once the user opts in). It does NOT schedule or deliver a real
 * "morning forecast" notification on its own — that requires a service worker + push
 * infrastructure that is out of scope for this iteration. showMorningForecastPreview() exists
 * so the UI can demonstrate what an alert will look like once that infrastructure exists.
 */
class NotificationService {
  isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window
  }

  getPermissionState(): NotificationPermissionState {
    if (!this.isSupported()) {
      return 'unsupported'
    }
    return Notification.permission
  }

  async requestPermission(): Promise<NotificationPermissionState> {
    if (!this.isSupported()) {
      return 'unsupported'
    }
    return Notification.requestPermission()
  }

  /** Fires a real, locally-triggered notification demonstrating the morning-forecast format. */
  showMorningForecastPreview(payload: MorningForecastPayload): void {
    if (this.getPermissionState() !== 'granted') {
      return
    }

    const rainNote = payload.rainExpected ? ' Rain expected this afternoon.' : ''
    const min = Math.round(payload.temperatureMinCelsius)
    const max = Math.round(payload.temperatureMaxCelsius)

    new Notification('Morning Forecast', {
      body: `${payload.locationLabel}\n${min}°C → ${max}°C${rainNote}`,
      icon: '/favicon.svg',
      tag: 'morning-forecast-preview',
    })
  }
}

export const notificationService = new NotificationService()
