import { getWeatherVisual, type WeatherVisualCategory } from '@/lib/weatherCondition'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/cn'

interface WeatherAnimationProps {
  weatherCode: number
  isDay: boolean
  size?: number
  className?: string
}

/** Renders the weather icon for a condition with a single, subtle, centrally-defined animation. */
export function WeatherAnimation({ weatherCode, isDay, size = 56, className }: WeatherAnimationProps) {
  const visual = getWeatherVisual(weatherCode, isDay)
  const reducedMotion = useReducedMotion()
  const Icon = visual.icon

  const iconAnimationClass = reducedMotion ? '' : iconAnimationFor(visual.category, isDay)

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={describeWeather(visual.category, isDay)}
    >
      <Icon
        className={cn(visual.colorClassName, iconAnimationClass)}
        style={{ width: size, height: size }}
        strokeWidth={1.5}
        aria-hidden="true"
      />
      {!reducedMotion && visual.particles !== 'none' && <ParticleOverlay kind={visual.particles} />}
    </div>
  )
}

function iconAnimationFor(category: WeatherVisualCategory, isDay: boolean): string {
  switch (category) {
    case 'clear':
    case 'mostly-clear':
      return isDay
        ? 'animate-[weather-spin-slow_28s_linear_infinite,weather-glow_4s_ease-in-out_infinite]'
        : ''
    case 'partly-cloudy':
    case 'cloudy':
    case 'fog':
      return 'animate-[weather-drift_6s_ease-in-out_infinite]'
    case 'thunderstorm':
      return 'animate-[weather-flash_5s_ease-in-out_infinite]'
    default:
      return ''
  }
}

function ParticleOverlay({ kind }: { kind: 'rain' | 'snow' | 'storm' }) {
  if (kind === 'storm') {
    return null
  }

  const particleClassName = kind === 'rain' ? 'h-2 w-px bg-sky-500' : 'size-1 rounded-full bg-slate-400'

  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center gap-2"
      aria-hidden="true"
    >
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className={cn(
            particleClassName,
            'animate-[weather-fall_1.4s_ease-in_infinite] opacity-0',
          )}
          style={{ animationDelay: `${index * 0.3}s` }}
        />
      ))}
    </div>
  )
}

function describeWeather(category: WeatherVisualCategory, isDay: boolean): string {
  return `${category.replace('-', ' ')} weather, ${isDay ? 'day' : 'night'}`
}
