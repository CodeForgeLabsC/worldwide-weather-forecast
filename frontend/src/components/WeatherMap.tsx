import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useActiveLocation } from '@/stores/LocationContext'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useCitiesForPreset } from '@/hooks/useCitiesForPreset'
import { cityToActiveLocation } from '@/lib/locationMapping'
import { INITIAL_MAP_CENTER, INITIAL_MAP_ZOOM, LOCATION_FLY_TO_ZOOM } from '@/lib/constants'
import { MAP_TILE_URL } from '@/lib/env'
import type { LocationSearchResult } from '@/types/location'

const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors ' +
  '&copy; <a href="https://carto.com/attributions">CARTO</a>'

const activeLocationIcon = L.divIcon({
  className: '',
  html: '<div class="location-marker location-marker--active"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

function createCityIcon(name: string): L.DivIcon {
  const label = name.replace(/"/g, '&quot;')
  return L.divIcon({
    className: '',
    html: `<div class="location-marker location-marker--city" aria-label="${label}"></div>`,
    iconSize: [10, 10],
    iconAnchor: [5, 5],
  })
}

interface WeatherMapProps {
  /** Called when the user clicks a curated city dot — used to open the city facts modal. */
  onSelectCity?: (city: LocationSearchResult) => void
}

/**
 * The dashboard's map card, sized by its parent (AppShell renders it as a bounded panel between
 * the weather and clock cards, not a full-bleed background). Raster tiles (not vector/WebGL) so
 * it renders on any browser, including ones without a WebGL2 context. The camera follows the
 * active location with a smooth fly-to transition (or an instant jump when the user prefers
 * reduced motion), and shows one dot per curated city for the active preset's country (see
 * `useCitiesForPreset`).
 */
export function WeatherMap({ onSelectCity }: WeatherMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<L.Map | null>(null)
  const activeMarkerRef = useRef<L.Marker | null>(null)
  const cityMarkersRef = useRef<L.Marker[]>([])
  const { activeLocation, setActiveLocation } = useActiveLocation()
  const reducedMotion = useReducedMotion()
  const { data: cities } = useCitiesForPreset(activeLocation.presetId)

  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    const map = L.map(containerRef.current, {
      center: INITIAL_MAP_CENTER,
      zoom: INITIAL_MAP_ZOOM,
      zoomControl: false,
      attributionControl: true,
    })

    L.tileLayer(MAP_TILE_URL, { attribution: ATTRIBUTION, maxZoom: 19 }).addTo(map)
    L.control.zoom({ position: 'bottomright' }).addTo(map)

    mapRef.current = map

    // The map now lives inside a flex/grid card rather than filling the viewport, so its size
    // changes with the layout (breakpoint switches, sidebar content height, window resize) —
    // Leaflet needs an explicit nudge to recompute tile layout when that happens.
    const resizeObserver = new ResizeObserver(() => map.invalidateSize())
    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
      map.remove()
      mapRef.current = null
      activeMarkerRef.current = null
      cityMarkersRef.current = []
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) {
      return
    }

    const latLng: [number, number] = [activeLocation.latitude, activeLocation.longitude]

    if (!activeMarkerRef.current) {
      activeMarkerRef.current = L.marker(latLng, { icon: activeLocationIcon, zIndexOffset: 1000 }).addTo(map)
    } else {
      activeMarkerRef.current.setLatLng(latLng)
    }

    if (reducedMotion) {
      map.setView(latLng, LOCATION_FLY_TO_ZOOM)
    } else {
      map.flyTo(latLng, LOCATION_FLY_TO_ZOOM, { duration: 1.2 })
    }
  }, [activeLocation, reducedMotion])

  useEffect(() => {
    const map = mapRef.current
    if (!map) {
      return
    }

    for (const marker of cityMarkersRef.current) {
      marker.remove()
    }
    cityMarkersRef.current = []

    if (!cities) {
      return
    }

    for (const city of cities) {
      const marker = L.marker([city.latitude, city.longitude], { icon: createCityIcon(city.name) })
        .addTo(map)
        .bindTooltip(city.name, { direction: 'top', offset: [0, -6] })
        .on('click', () => {
          setActiveLocation(cityToActiveLocation(city, activeLocation.presetId))
          onSelectCity?.(city)
        })
      cityMarkersRef.current.push(marker)
    }
  }, [cities, activeLocation.presetId, setActiveLocation, onSelectCity])

  return <div ref={containerRef} className="h-full w-full" role="application" aria-label="World map" />
}
