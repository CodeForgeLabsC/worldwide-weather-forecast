import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useBrowserLocation } from './useBrowserLocation'

describe('useBrowserLocation', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('reports denied status when the user rejects the permission prompt', async () => {
    const getCurrentPosition = vi.fn(
      (_success: PositionCallback, error: PositionErrorCallback) => {
        error({ code: 1, message: 'User denied Geolocation' } as GeolocationPositionError)
      },
    )
    vi.stubGlobal('navigator', { geolocation: { getCurrentPosition } })

    const { result } = renderHook(() => useBrowserLocation())

    await waitFor(() => expect(result.current.status).toBe('denied'))
    expect(result.current.coordinates).toBeNull()
  })

  it('reports unavailable status when geolocation is not supported', () => {
    vi.stubGlobal('navigator', {})

    const { result } = renderHook(() => useBrowserLocation())

    expect(result.current.status).toBe('unavailable')
    expect(result.current.coordinates).toBeNull()
  })

  it('reports granted status with coordinates on success', async () => {
    const getCurrentPosition = vi.fn((success: PositionCallback) => {
      success({ coords: { latitude: 52.23, longitude: 21.01 } } as GeolocationPosition)
    })
    vi.stubGlobal('navigator', { geolocation: { getCurrentPosition } })

    const { result } = renderHook(() => useBrowserLocation())

    await waitFor(() => expect(result.current.status).toBe('granted'))
    expect(result.current.coordinates).toEqual({ latitude: 52.23, longitude: 21.01 })
  })
})
