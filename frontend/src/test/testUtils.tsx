import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LocationProvider } from '@/stores/LocationContext'
import { PreferencesProvider } from '@/stores/PreferencesContext'

export function renderWithProviders(ui: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <LocationProvider>
        <PreferencesProvider>{ui}</PreferencesProvider>
      </LocationProvider>
    </QueryClientProvider>,
  )
}
