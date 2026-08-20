import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { LocationProvider } from '@/stores/LocationContext'
import { PreferencesProvider } from '@/stores/PreferencesContext'
import { DashboardPage } from '@/pages/DashboardPage'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LocationProvider>
        <PreferencesProvider>
          <DashboardPage />
        </PreferencesProvider>
      </LocationProvider>
    </QueryClientProvider>
  )
}

export default App
