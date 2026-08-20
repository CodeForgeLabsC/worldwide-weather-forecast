import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useLocationSearch } from './useLocationSearch'
import * as locationsApi from '@/api/locations'

vi.mock('@/api/locations')

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

describe('useLocationSearch', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('debounces keystrokes and only calls the API once, after the delay', async () => {
    vi.useFakeTimers()
    const searchMock = vi.mocked(locationsApi.searchLocations).mockResolvedValue([])

    const { result } = renderHook(() => useLocationSearch(), { wrapper })

    act(() => result.current.setQuery('W'))
    act(() => result.current.setQuery('Wa'))
    act(() => result.current.setQuery('War'))

    expect(searchMock).not.toHaveBeenCalled()

    await act(async () => {
      vi.advanceTimersByTime(400)
    })

    expect(searchMock).toHaveBeenCalledTimes(1)
    expect(searchMock).toHaveBeenCalledWith('War', expect.anything())
  })

  it('does not call the API for an empty query', async () => {
    vi.useFakeTimers()
    const searchMock = vi.mocked(locationsApi.searchLocations).mockResolvedValue([])

    renderHook(() => useLocationSearch(), { wrapper })

    await act(async () => {
      vi.advanceTimersByTime(1000)
    })

    expect(searchMock).not.toHaveBeenCalled()
  })
})
