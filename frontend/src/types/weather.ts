export interface WeatherLocation {
  latitude: number
  longitude: number
  timezone: string
}

export interface CurrentWeather {
  location: WeatherLocation
  temperature: number
  apparentTemperature: number
  humidity: number
  windSpeed: number
  windDirection: number
  weatherCode: number
  condition: string
  isDay: boolean
  precipitationProbability: number | null
}

export interface DailyForecast {
  date: string
  weatherCode: number
  condition: string
  temperatureMax: number
  temperatureMin: number
  precipitationProbability: number | null
  sunrise: string | null
  sunset: string | null
  windSpeedMax: number
}

export interface Forecast {
  location: WeatherLocation
  days: DailyForecast[]
}

export type TemperatureUnit = 'celsius' | 'fahrenheit'
export type WindSpeedUnit = 'kmh' | 'mph'

export interface UnitPreferences {
  temperature: TemperatureUnit
  windSpeed: WindSpeedUnit
}
