/**
 * Best-effort human label derived from an IANA timezone identifier, used when a location
 * (e.g. one resolved from the browser's raw geolocation coordinates) has no place name.
 * "Europe/Warsaw" -> "Warsaw", "America/Argentina/Buenos_Aires" -> "Buenos Aires".
 */
export function timezoneToLabel(timezone: string): string {
  const segments = timezone.split('/')
  const last = segments.at(-1) ?? timezone
  return last.replace(/_/g, ' ')
}

export function timezoneToRegion(timezone: string): string {
  const segments = timezone.split('/')
  return segments.length > 1 ? (segments[0]?.replace(/_/g, ' ') ?? '') : ''
}
