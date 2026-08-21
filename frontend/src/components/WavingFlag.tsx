import type { ComponentType } from 'react'
import { cn } from '@/lib/cn'

/**
 * Small library of recognizable flags for the dashboard's curated presets. Anything outside
 * this set falls back to a deterministic two-tone banner (`AbstractFlag`) so unknown countries
 * still render something flag-shaped instead of nothing.
 */
function UsFlag() {
  return (
    <svg viewBox="0 0 60 40" preserveAspectRatio="none" role="img" aria-label="United States flag">
      <rect width="60" height="40" fill="#B22234" />
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={i} y={(i * 2 + 1) * (40 / 13)} width="60" height={40 / 13} fill="#fff" />
      ))}
      <rect width="26" height={40 * (7 / 13)} fill="#3C3B6E" />
      {Array.from({ length: 4 }, (_, row) =>
        Array.from({ length: 5 }, (_, col) => (
          <circle key={`${row}-${col}`} cx={3 + col * 5} cy={3 + row * 4.5} r="0.9" fill="#fff" />
        )),
      )}
    </svg>
  )
}

function PolandFlag() {
  return (
    <svg viewBox="0 0 60 40" preserveAspectRatio="none" role="img" aria-label="Poland flag">
      <rect width="60" height="20" fill="#fff" />
      <rect y="20" width="60" height="20" fill="#DC143C" />
    </svg>
  )
}

function BrazilFlag() {
  return (
    <svg viewBox="0 0 60 40" preserveAspectRatio="none" role="img" aria-label="Brazil flag">
      <rect width="60" height="40" fill="#009739" />
      <polygon points="30,4 56,20 30,36 4,20" fill="#FEDD00" />
      <circle cx="30" cy="20" r="8" fill="#012169" />
    </svg>
  )
}

function MexicoFlag() {
  return (
    <svg viewBox="0 0 60 40" preserveAspectRatio="none" role="img" aria-label="Mexico flag">
      <rect width="20" height="40" fill="#006341" />
      <rect x="20" width="20" height="40" fill="#fff" />
      <rect x="40" width="20" height="40" fill="#CE1126" />
      <circle cx="30" cy="20" r="4.5" fill="none" stroke="#006341" strokeWidth="1" />
    </svg>
  )
}

function JapanFlag() {
  return (
    <svg viewBox="0 0 60 40" preserveAspectRatio="none" role="img" aria-label="Japan flag">
      <rect width="60" height="40" fill="#fff" />
      <circle cx="30" cy="20" r="8" fill="#BC002D" />
    </svg>
  )
}

const CURATED_FLAGS: Record<string, ComponentType> = {
  US: UsFlag,
  PL: PolandFlag,
  BR: BrazilFlag,
  MX: MexicoFlag,
  JP: JapanFlag,
}

const ABSTRACT_PALETTE: [string, string][] = [
  ['#0ea5e9', '#0f172a'],
  ['#f59e0b', '#0f172a'],
  ['#7c3aed', '#f8fafc'],
  ['#10b981', '#0f172a'],
  ['#ef4444', '#f8fafc'],
  ['#2563eb', '#f8fafc'],
]

function hashCode(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  }
  return hash
}

function AbstractFlag({ countryCode }: { countryCode: string }) {
  const [primary, secondary] =
    ABSTRACT_PALETTE[hashCode(countryCode) % ABSTRACT_PALETTE.length] ?? ABSTRACT_PALETTE[0]!
  return (
    <svg viewBox="0 0 60 40" preserveAspectRatio="none" role="img" aria-label={`${countryCode} flag`}>
      <rect width="60" height="40" fill={secondary} />
      <rect width="60" height="20" fill={primary} />
      <circle cx="30" cy="20" r="7" fill={secondary} opacity="0.9" />
    </svg>
  )
}

interface WavingFlagProps {
  countryCode?: string | null
  className?: string
}

/**
 * A small flag that flutters in place via a CSS transform loop (see `.waving-flag` in
 * index.css) rather than a static unicode flag emoji, which several Linux font stacks render
 * as flat two-letter fallback text instead of a real flag glyph. Each country gets a stable
 * animation offset (hashed from its code) so a row of flags doesn't flutter in lockstep.
 */
export function WavingFlag({ countryCode, className }: WavingFlagProps) {
  const code = countryCode?.toUpperCase()
  const Flag = code ? CURATED_FLAGS[code] : undefined
  const delay = ((code ? hashCode(code) : 0) % 10) / 10

  return (
    <span
      aria-hidden="true"
      className={cn('waving-flag inline-block overflow-hidden rounded-[2px] ring-1 ring-black/10', className)}
      style={{ animationDelay: `${delay}s` }}
    >
      {Flag ? <Flag /> : <AbstractFlag countryCode={code ?? '??'} />}
    </span>
  )
}
