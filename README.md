# Meridian — Weather & Local-Time Dashboard

A global weather and local-time intelligence dashboard: a full-screen interactive world map
with glass panels for current weather, local time, and a 7-day forecast floating on top.
Built as a monorepo with an ASP.NET Core 10 API and a React 19 + TypeScript frontend.

## Architecture

```
weather-dashboard/
  backend/
    WeatherDashboard.Domain/          # Entities, value objects, weather-code mapping — no dependencies
    WeatherDashboard.Application/     # Use cases, DTOs, IWeatherProvider/IWeatherService/ILocationService abstractions
    WeatherDashboard.Infrastructure/  # Open-Meteo provider implementation, caching decorator
    WeatherDashboard.Api/             # Controllers, DI wiring, ProblemDetails error handling
    WeatherDashboard.Tests/           # xUnit tests for Application + Infrastructure
  frontend/
    src/
      api/          # Thin fetch wrappers around the backend REST API
      components/   # Presentational + composed UI (AppShell, WeatherMap, cards, etc.)
      hooks/         # useCurrentWeather, useForecast, useLocationSearch, useBrowserLocation, useLocationClock, ...
      lib/           # weather-code → icon/animation mapping, constants, env, query client
      pages/         # DashboardPage
      services/      # NotificationService (browser Notification API abstraction)
      stores/        # LocationContext, PreferencesContext (React context, no Redux)
      types/         # Location, Weather, Notification types
      utils/         # unit formatting, timezone label derivation, flag emoji
    e2e/             # Playwright end-to-end tests (backend API mocked at the network layer)
  docker-compose.yml
```

**Provider abstraction:** controllers and React components never see Open-Meteo's (or
Wikipedia's) response shape. `IWeatherProvider` / `IGeocodingProvider` / `IEncyclopediaProvider`
(Application) are implemented by `OpenMeteoWeatherProvider` / `OpenMeteoGeocodingProvider` /
`WikipediaEncyclopediaProvider` (Infrastructure); a `CachingWeatherProvider` decorator adds
short-lived, coordinate-normalized in-memory caching in front of the real weather provider.
Controllers return only hand-authored `*Dto` types.

## Prerequisites

- [.NET SDK 10](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org) and npm
- Docker (optional, for the containerized workflow)

## Backend

```bash
cd backend
dotnet restore
dotnet build
dotnet test
dotnet run --project WeatherDashboard.Api
```

The API listens on the URL/port from `WeatherDashboard.Api/Properties/launchSettings.json`
(or set `ASPNETCORE_URLS`, e.g. `ASPNETCORE_URLS=http://localhost:5299 dotnet run --project WeatherDashboard.Api`).
Once running, try:

```bash
curl "http://localhost:5299/api/health"
curl "http://localhost:5299/api/locations/presets"
curl "http://localhost:5299/api/weather/current?lat=52.2297&lon=21.0122"
curl "http://localhost:5299/api/weather/forecast?lat=52.2297&lon=21.0122&days=7"
curl "http://localhost:5299/api/locations/search?q=Warsaw"
curl "http://localhost:5299/api/locations/presets/poland/cities"
curl "http://localhost:5299/api/locations/facts?name=O%C5%9Bwi%C4%99cim&countryCode=PL"
```

Configuration lives in `WeatherDashboard.Api/appsettings.json` /
`appsettings.Development.json` (`OpenMeteo:*` for provider base URLs, timeout, and cache
duration; `Encyclopedia:BaseUrl` for the Wikipedia summary API used by city facts;
`Cors:AllowedOrigins` for the frontend origin(s) allowed to call the API — no wildcard in
production).

## Frontend

```bash
cd frontend
cp .env.example .env    # adjust VITE_API_BASE_URL if the backend isn't on localhost:5299
npm install
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`). The dashboard works even
without a running backend for static/UI review, but weather, forecast, presets, and search
all require the API above to be reachable at `VITE_API_BASE_URL`.

### Frontend tests

```bash
npm run test          # Vitest + React Testing Library, single run
npm run test:watch    # watch mode
npm run test:e2e      # Playwright E2E (see below)
```

Playwright needs its browser binaries once: `npx playwright install chromium`. The E2E suite
intercepts every `/api/**` call with fixture data (see `e2e/fixtures.ts`), so it never depends
on a live backend or the live Open-Meteo API — it only needs `npm run build` to have produced
a `dist/` (Playwright's `webServer` config runs `npm run preview` against it automatically).

## Docker

```bash
docker compose up --build
```

This builds and runs both services: the API on `http://localhost:5299` and the frontend
(served by nginx) on `http://localhost:5173`, with CORS pre-configured between them. Get the
normal `dotnet`/`npm` workflows above working first — Docker is a convenience on top, not a
requirement for development.

## API summary

| Endpoint | Description |
| --- | --- |
| `GET /api/weather/current?lat&lon` | Current conditions for a coordinate |
| `GET /api/weather/forecast?lat&lon&days=7` | Up to 16 days of daily forecast (defaults to 7) |
| `GET /api/locations/search?q=` | Geocoding search (debounced client-side, 300–400ms), includes population when known |
| `GET /api/locations/presets` | The five curated shortcut locations (California, Poland, Brazil, Mexico, Japan) |
| `GET /api/locations/presets/{id}/cities` | 5–6 curated cities for a preset's country (e.g. Oświęcim for `poland`) |
| `GET /api/locations/facts?name&countryCode` | Best-effort population + Wikipedia summary for a place name |
| `GET /api/health` | Liveness check |

Coordinates are validated server-side (`lat` ∈ [-90, 90], `lon` ∈ [-180, 180]); invalid input
returns a `400` `ProblemDetails` response. Upstream provider failures are logged with full
detail server-side and surfaced to clients as a generic `502` — no provider internals leak.

## Product behavior notes

- The map, weather panel, and clock all default to **Warsaw, Poland** and a Central-Europe
  camera on first load — the dashboard is fully usable with zero permissions granted.
- The map renders **raster tiles via Leaflet** (CARTO's free "Positron" light basemap by
  default), not a WebGL/vector engine — it works on any browser, including ones without a
  WebGL2 context.
- Each preset's country shows a handful of curated city dots on the map (`PresetCities.cs`
  backend-side, `useCitiesForPreset` frontend-side). Clicking one switches the active
  location — same as clicking a preset button — and opens the **city facts modal**: a real
  population figure (from Open-Meteo's geocoding data) and a real Wikipedia summary, never
  invented restaurant/landmark lists.
- The always-visible search bar below the top nav finds any city worldwide via the same
  geocoding search used by the presets.
- Geolocation is requested after first paint, never blocking it. On denial or unavailability,
  a small dismissible notice appears; nothing else about the dashboard degrades.
- The local clock ticks client-side every second via `Intl.DateTimeFormat` — it never polls
  the backend for time.
- Weather-code → icon/animation/label mapping is centralized (`WeatherCodeMapper` on the
  backend for the human-readable `condition` label, `lib/weatherCondition.tsx` on the frontend
  for icon/animation/day-night selection) so no component branches on raw codes individually.
- `prefers-reduced-motion` disables map fly-to easing (falls back to an instant jump), the
  active-location marker's bounce animation, and all decorative weather icon animation.
- Browser notification permission is only requested when the user presses **Enable Weather
  Alerts** in the notification panel — never on load. Today this sends a one-time local
  preview notification; scheduled delivery needs push infrastructure and is intentionally not
  implemented yet (see `services/NotificationService.ts` for the seam).

## Testing coverage

- **Backend (xUnit):** weather-code mapping, coordinate validation, forecast transformation,
  weather-provider mapping, provider-failure/caching behavior (including that failed provider
  calls are never cached), preset city lists (including that Poland's includes Oświęcim), and
  city-facts enrichment (population + Wikipedia summary combine correctly, and a missing
  Wikipedia article degrades gracefully instead of throwing).
- **Frontend (Vitest + RTL):** current-weather rendering, forecast rendering, preset-driven
  location switching, denied-geolocation status, local-timezone clock formatting/switching,
  debounced search state, and city-marker location mapping.
- **E2E (Playwright):** app boot and default dashboard render, Poland/Japan preset switching,
  weather/forecast rendering, the always-visible search bar, clicking a curated city dot
  (switches location and opens the city facts modal with real population/summary data), and a
  mobile-viewport overflow check.

## Environment files

- `backend/WeatherDashboard.Api/appsettings.json` / `appsettings.Development.json` — committed,
  no secrets (Open-Meteo needs no API key).
- `frontend/.env.example` — copy to `.env` for local dev. Never commit `.env`.
