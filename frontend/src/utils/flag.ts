/** Converts a two-letter ISO country code into its regional-indicator flag emoji. */
export function countryCodeToFlagEmoji(countryCode: string): string {
  if (countryCode.length !== 2) {
    return ''
  }

  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
}
