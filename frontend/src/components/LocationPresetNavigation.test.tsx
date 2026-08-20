import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { renderWithProviders } from '@/test/testUtils'
import { LocationPresetNavigation } from './LocationPresetNavigation'
import * as locationsApi from '@/api/locations'
import { useActiveLocation } from '@/stores/LocationContext'
import type { PresetLocation } from '@/types/location'

vi.mock('@/api/locations')

const PRESETS: PresetLocation[] = [
  {
    id: 'poland',
    label: 'Poland',
    city: 'Warsaw',
    country: 'Poland',
    countryCode: 'PL',
    latitude: 52.2297,
    longitude: 21.0122,
    timezone: 'Europe/Warsaw',
  },
  {
    id: 'japan',
    label: 'Japan',
    city: 'Tokyo',
    country: 'Japan',
    countryCode: 'JP',
    latitude: 35.6762,
    longitude: 139.6503,
    timezone: 'Asia/Tokyo',
  },
]

function ActiveLocationProbe() {
  const { activeLocation } = useActiveLocation()
  return <div data-testid="active-city">{activeLocation.city}</div>
}

describe('LocationPresetNavigation', () => {
  it('switches the shared active location when a preset is clicked', async () => {
    vi.mocked(locationsApi.getPresetLocations).mockResolvedValue(PRESETS)

    renderWithProviders(
      <>
        <LocationPresetNavigation />
        <ActiveLocationProbe />
      </>,
    )

    expect(screen.getByTestId('active-city')).toHaveTextContent('Warsaw')

    const japanButton = await screen.findByRole('button', { name: /japan/i })
    fireEvent.click(japanButton)

    expect(screen.getByTestId('active-city')).toHaveTextContent('Tokyo')
    expect(japanButton).toHaveAttribute('aria-pressed', 'true')
  })
})
