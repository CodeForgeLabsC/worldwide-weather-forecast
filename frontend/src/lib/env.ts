export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5299'

/** Leaflet raster tile URL template ({s}/{z}/{x}/{y}/{r}) — no WebGL required to render. */
export const MAP_TILE_URL =
  import.meta.env.VITE_MAP_TILE_URL || 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
