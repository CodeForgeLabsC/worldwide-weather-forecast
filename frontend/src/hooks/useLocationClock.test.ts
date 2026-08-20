import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLocationClock } from './useLocationClock'

describe('useLocationClock', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('formats the current time for the given IANA timezone', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-08-19T20:18:42Z'))

    const { result } = renderHook(() => useLocationClock('Europe/Warsaw'))

    expect(result.current.time).toBe('22:18:42')
  })

  it('advances the displayed time every second without a network call', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-08-19T20:18:42Z'))

    const { result } = renderHook(() => useLocationClock('Europe/Warsaw'))
    expect(result.current.time).toBe('22:18:42')

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(result.current.time).toBe('22:18:43')
  })

  it('switches timezone immediately when the location changes', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-08-19T20:18:42Z'))

    const { result, rerender } = renderHook(({ timezone }) => useLocationClock(timezone), {
      initialProps: { timezone: 'Europe/Warsaw' },
    })
    expect(result.current.time).toBe('22:18:42')

    rerender({ timezone: 'Asia/Tokyo' })

    expect(result.current.time).toBe('05:18:42')
  })
})
