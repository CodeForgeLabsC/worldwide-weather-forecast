import { useEffect, useMemo, useState } from 'react'

export interface LocationClock {
  time: string
  weekday: string
  monthDay: string
}

/**
 * Ticks a local clock every second and formats it for the given IANA timezone via Intl.
 * Never calls the backend — the browser's own clock plus Intl.DateTimeFormat is sufficient,
 * and re-creating the formatters when `timezone` changes makes the switch instantaneous.
 */
export function useLocationClock(timezone: string): LocationClock {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const intervalId = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(intervalId)
  }, [])

  const formatters = useMemo(
    () => ({
      time: new Intl.DateTimeFormat('en-GB', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }),
      weekday: new Intl.DateTimeFormat('en-US', { timeZone: timezone, weekday: 'long' }),
      monthDay: new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        month: 'long',
        day: 'numeric',
      }),
    }),
    [timezone],
  )

  return {
    time: formatters.time.format(now),
    weekday: formatters.weekday.format(now),
    monthDay: formatters.monthDay.format(now),
  }
}
