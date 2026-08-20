# Architecture Notes

## Backend layering

```
WeatherDashboard.Api            (controllers, DI wiring, ProblemDetails middleware)
        |  depends on
        v
WeatherDashboard.Application     (IWeatherService, ILocationService, IWeatherProvider,
                                   IGeocodingProvider, DTOs, validators)
        |  depends on
        v
WeatherDashboard.Domain          (Coordinates, WeatherCondition, WeatherCodeMapper,
                                   PresetLocation, GeoLocation — zero dependencies)

WeatherDashboard.Infrastructure  (OpenMeteoWeatherProvider, OpenMeteoGeocodingProvider,
                                   CachingWeatherProvider) implements Application's
                                   provider interfaces; Api depends on Infrastructure only
                                   to wire it up in DependencyInjection.cs, never to call
                                   it directly.
```

The dependency rule that matters most: **`WeatherController` and `LocationsController` only
know about `IWeatherService`/`ILocationService` and the `*Dto` types.** Nothing in
`Application` or `Api` references `OpenMeteoForecastResponse` or any other Open-Meteo-shaped
type — those live entirely inside `Infrastructure/OpenMeteo/`. Swapping weather providers
means writing a new `IWeatherProvider` implementation and changing one line in
`Infrastructure/DependencyInjection.cs`; nothing else moves.

`CachingWeatherProvider` is a decorator, not a special case baked into `OpenMeteoWeatherProvider`
— it wraps whatever `IWeatherProvider` is registered, keyed by coordinates rounded to 3 decimal
places (`Coordinates.ToCacheKey()`), so two requests for "basically the same point" share a
cache entry instead of missing on floating-point noise. A failed upstream call is never cached
(the cache is only populated after `await factory()` succeeds), so a transient Open-Meteo
outage doesn't get "stuck" for the cache's TTL.

## Frontend state model

Two concerns are deliberately kept separate:

- **Server state** (weather, forecast, search results, presets) lives entirely in TanStack
  Query, keyed by rounded coordinates (`useCurrentWeather`, `useForecast`) or by the debounced
  query string (`useLocationSearch`). There is no manual `useEffect` + `fetch` + `useState`
  anywhere in the component tree.
- **Client state** (which location is active, unit preferences) lives in two small React
  Contexts (`LocationContext`, `PreferencesContext`) — no Redux, because there isn't enough
  cross-cutting client state to justify it. `ActiveLocation` is the one shape every
  location-aware component reads from (`CurrentWeatherCard`, `LocalTimeCard`, `WeatherMap`,
  `ForecastStrip`), regardless of whether it came from a preset click, a search result, or a
  geolocation fix — see `lib/locationMapping.ts` for the three constructors that produce it.

## Why geolocation and rendering aren't coupled

`AppShell` renders immediately with `DEFAULT_LOCATION` (Warsaw) already in context — there is
no loading state gating the first paint on `navigator.geolocation`. `useBrowserLocation` fires
the permission request in a `useEffect` on mount and reports `idle → requesting → granted |
denied | unavailable`. `useInitialLocationSync` (composed once, in `AppShell`) watches that
status and applies a successful fix to the shared `ActiveLocation` **exactly once**, and only
if the user hasn't already picked a preset or search result in the meantime — so a slow
permission prompt can never stomp on a deliberate user action that happened while it was
pending.

## Weather-code mapping stays in one place, on each side

The backend's `WeatherCodeMapper` (Domain) turns a WMO code into a `WeatherCondition` enum +
human label — that's the `condition` string in every API response. The frontend has its own
`lib/weatherCondition.tsx`, keyed off the same WMO codes returned as `weatherCode`, but
answering a different question: which Lucide icon, which color, which decorative animation
(rain/snow/storm particles), and which day/night variant. Neither side branches on raw codes
outside these two files — `WeatherAnimation`, `CurrentWeatherCard`, and `ForecastDayCard` all
just call `getWeatherVisual()`.

## Deferred (by design, not by oversight)

Section 36 of the product brief lists radar, air quality, saved cities, accounts, PWA install,
push notifications, and map data layers as explicit non-goals for this iteration. The seams
left for them:

- `NotificationService` already separates "can we show a browser notification right now" from
  "deliver a scheduled morning forecast," which needs a service worker + push subscription
  this iteration doesn't implement.
- `UnitPreferences`/`utils/units.ts` already support Fahrenheit and mph end-to-end; only the
  default and the visible toggle default to metric.
- `ActiveLocation.source` (`'geolocation' | 'preset' | 'search' | 'default' | 'city'`) is
  already general enough to support a future "saved cities" list without a shape change.

## City facts: real data only, no invented content

The city facts modal shows a population figure and an encyclopedic summary — both sourced live
(Open-Meteo's geocoding `population` field via `IGeocodingProvider`, and a Wikipedia REST
summary via the new `IEncyclopediaProvider`/`WikipediaEncyclopediaProvider`). It deliberately
does **not** list specific restaurants, buildings, or parks: those would require a paid, keyed
places API (Google Places, Foursquare, Yelp), and inventing plausible-sounding names instead
would present false information as fact. `IEncyclopediaProvider` is a clean seam for adding a
places layer later once a key is available — nothing about `CityFactsDto` or the modal would
need to change shape, only gain fields.
