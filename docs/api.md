# API Reference

Base URL in development: `http://localhost:5299` (configurable via the frontend's
`VITE_API_BASE_URL`). All responses are JSON. Errors use RFC 9457 `application/problem+json`.

## `GET /api/weather/current`

Current conditions for a coordinate.

**Query parameters**

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| `lat` | number | yes | -90 to 90 |
| `lon` | number | yes | -180 to 180 |

**200 response**

```json
{
  "location": { "latitude": 52.2297, "longitude": 21.0122, "timezone": "Europe/Warsaw" },
  "temperature": 21.4,
  "apparentTemperature": 22.1,
  "humidity": 64,
  "windSpeed": 11.2,
  "windDirection": 240,
  "weatherCode": 2,
  "condition": "Partly Cloudy",
  "isDay": true,
  "precipitationProbability": 20
}
```

`weatherCode` is the raw WMO code (also used by Open-Meteo); `condition` is the
human-readable label produced by the backend's centralized `WeatherCodeMapper`.
`precipitationProbability` is nullable — Open-Meteo only exposes it hourly, so it's resolved
from the hourly series at the current hour and may be unavailable.

## `GET /api/weather/forecast`

Daily forecast for a coordinate.

**Query parameters**

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| `lat` | number | yes | -90 to 90 |
| `lon` | number | yes | -180 to 180 |
| `days` | integer | no | 1–16, defaults to 7 |

**200 response**

```json
{
  "location": { "latitude": 52.2297, "longitude": 21.0122, "timezone": "Europe/Warsaw" },
  "days": [
    {
      "date": "2026-08-19",
      "weatherCode": 63,
      "condition": "Rain",
      "temperatureMax": 22.1,
      "temperatureMin": 13.3,
      "precipitationProbability": 78,
      "sunrise": "2026-08-19T05:26:00+02:00",
      "sunset": "2026-08-19T19:52:00+02:00",
      "windSpeedMax": 15.1
    }
  ]
}
```

`sunrise`/`sunset` are `DateTimeOffset` values in the location's local UTC offset (Open-Meteo
returns local-time strings without an offset; the backend attaches `utc_offset_seconds` itself
so clients never have to guess the zone).

## `GET /api/locations/search`

Geocoding search.

**Query parameters**

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| `q` | string | yes | 1–100 characters |

**200 response**

```json
[
  { "name": "Warsaw", "country": "Poland", "countryCode": "PL", "latitude": 52.22977, "longitude": 21.01178, "timezone": "Europe/Warsaw", "population": 1702139 },
  { "name": "Warsaw", "country": "United States", "countryCode": "US", "latitude": 41.2381, "longitude": -85.85305, "timezone": "America/Indiana/Indianapolis", "population": 14472 }
]
```

An empty array (not an error) is returned when nothing matches. `population` is `null` when
Open-Meteo doesn't report one for that place.

## `GET /api/locations/presets`

The dashboard's five curated shortcuts. Always returns the same five entries; no query
parameters.

```json
[
  { "id": "california-us", "label": "California", "city": "Los Angeles", "country": "United States", "countryCode": "US", "latitude": 34.0522, "longitude": -118.2437, "timezone": "America/Los_Angeles" },
  { "id": "poland", "label": "Poland", "city": "Warsaw", "country": "Poland", "countryCode": "PL", "latitude": 52.2297, "longitude": 21.0122, "timezone": "Europe/Warsaw" },
  { "id": "brazil", "label": "Brazil", "city": "São Paulo", "country": "Brazil", "countryCode": "BR", "latitude": -23.5505, "longitude": -46.6333, "timezone": "America/Sao_Paulo" },
  { "id": "mexico", "label": "Mexico", "city": "Mexico City", "country": "Mexico", "countryCode": "MX", "latitude": 19.4326, "longitude": -99.1332, "timezone": "America/Mexico_City" },
  { "id": "japan", "label": "Japan", "city": "Tokyo", "country": "Japan", "countryCode": "JP", "latitude": 35.6762, "longitude": 139.6503, "timezone": "Asia/Tokyo" }
]
```

## `GET /api/locations/presets/{id}/cities`

5–6 curated cities for a preset's country (empty array for an unknown `id`).

```json
[
  { "name": "Warsaw", "country": "Poland", "countryCode": "PL", "latitude": 52.2297, "longitude": 21.0122, "timezone": "Europe/Warsaw", "population": null },
  { "name": "Oświęcim", "country": "Poland", "countryCode": "PL", "latitude": 50.0343, "longitude": 19.221, "timezone": "Europe/Warsaw", "population": null }
]
```

`population` is always `null` here — this list is the curated static dataset, not a live
geocoding lookup. Use `/api/locations/facts` for a real population figure.

## `GET /api/locations/facts`

Best-effort enrichment for a place name: a population match from geocoding search plus a
Wikipedia summary. Never 404s for "no data found" — fields are simply `null`.

**Query parameters**

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| `name` | string | yes | 1–100 characters |
| `countryCode` | string | no | Narrows the population match when the name is ambiguous |

**200 response**

```json
{
  "name": "Oświęcim",
  "country": "Poland",
  "population": 34170,
  "summary": "Oświęcim is a town in the Lesser Poland Voivodeship in southern Poland...",
  "thumbnailUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/...",
  "sourceUrl": "https://en.wikipedia.org/wiki/O%C5%9Bwi%C4%99cim"
}
```

## `GET /api/health`

```json
{ "status": "healthy", "timestampUtc": "2026-08-19T20:37:22.5771292+00:00" }
```

## Error shape

Invalid input (bad coordinates, out-of-range `days`, malformed `q`) returns `400` with a
validation `ProblemDetails` body. Upstream provider failures return `502` with a generic,
pre-authored `detail` message — the underlying Open-Meteo exception is logged server-side but
never included in the response body.

```json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "detail": "Latitude must be between -90 and 90, and longitude between -180 and 180.",
  "errors": {},
  "traceId": "00-d59561485df859c7ce96e16f913f59bf-9f182220e9bfdcef-00"
}
```
