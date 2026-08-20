import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  Snowflake,
  CloudLightning,
  type LucideIcon,
} from 'lucide-react'

export type WeatherVisualCategory =
  | 'clear'
  | 'mostly-clear'
  | 'partly-cloudy'
  | 'cloudy'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'heavy-rain'
  | 'snow'
  | 'snow-showers'
  | 'thunderstorm'

export interface WeatherVisual {
  category: WeatherVisualCategory
  icon: LucideIcon
  colorClassName: string
  /** Which decorative particle style (if any) WeatherAnimation should overlay. */
  particles: 'none' | 'rain' | 'snow' | 'storm'
}

/**
 * Single source of truth mapping WMO weather codes (as returned by the API's `weatherCode`
 * field) to a visual category. Mirrors the backend's WeatherCodeMapper so the two stay in
 * conceptual lock-step, but owns presentation concerns (icon, color, animation) that belong
 * on the frontend. No component should branch on a raw weather code directly — call
 * getWeatherVisual() instead.
 */
function categoryFor(weatherCode: number): WeatherVisualCategory {
  if (weatherCode === 0) return 'clear'
  if (weatherCode === 1) return 'mostly-clear'
  if (weatherCode === 2) return 'partly-cloudy'
  if (weatherCode === 3) return 'cloudy'
  if (weatherCode === 45 || weatherCode === 48) return 'fog'
  if ([51, 53, 55, 56, 57].includes(weatherCode)) return 'drizzle'
  if ([61, 63, 80, 81].includes(weatherCode)) return 'rain'
  if ([65, 66, 67, 82].includes(weatherCode)) return 'heavy-rain'
  if ([71, 73, 77].includes(weatherCode)) return 'snow'
  if (weatherCode === 75 || weatherCode === 85 || weatherCode === 86) return 'snow-showers'
  if ([95, 96, 99].includes(weatherCode)) return 'thunderstorm'
  return 'cloudy'
}

export function getWeatherVisual(weatherCode: number, isDay: boolean): WeatherVisual {
  const category = categoryFor(weatherCode)

  switch (category) {
    case 'clear':
      return {
        category,
        icon: isDay ? Sun : Moon,
        colorClassName: isDay ? 'text-amber-500' : 'text-slate-500',
        particles: 'none',
      }
    case 'mostly-clear':
      return {
        category,
        icon: isDay ? Sun : Moon,
        colorClassName: isDay ? 'text-amber-500' : 'text-slate-500',
        particles: 'none',
      }
    case 'partly-cloudy':
      return {
        category,
        icon: isDay ? CloudSun : CloudMoon,
        colorClassName: 'text-slate-500',
        particles: 'none',
      }
    case 'cloudy':
      return { category, icon: Cloud, colorClassName: 'text-slate-500', particles: 'none' }
    case 'fog':
      return { category, icon: CloudFog, colorClassName: 'text-slate-500', particles: 'none' }
    case 'drizzle':
      return { category, icon: CloudDrizzle, colorClassName: 'text-sky-500', particles: 'rain' }
    case 'rain':
      return { category, icon: CloudRain, colorClassName: 'text-sky-600', particles: 'rain' }
    case 'heavy-rain':
      return { category, icon: CloudRainWind, colorClassName: 'text-sky-600', particles: 'rain' }
    case 'snow':
      return { category, icon: CloudSnow, colorClassName: 'text-slate-400', particles: 'snow' }
    case 'snow-showers':
      return { category, icon: Snowflake, colorClassName: 'text-slate-400', particles: 'snow' }
    case 'thunderstorm':
      return {
        category,
        icon: CloudLightning,
        colorClassName: 'text-violet-500',
        particles: 'storm',
      }
  }
}
