namespace WeatherDashboard.Application.Weather;

/// <summary>
/// Provider-agnostic shape that any <c>IWeatherProvider</c> implementation must produce.
/// Nothing outside Infrastructure should know these values originated from Open-Meteo (or
/// any other specific provider).
/// </summary>
public sealed record ProviderCurrentWeather(
    double Temperature,
    double ApparentTemperature,
    int Humidity,
    double WindSpeed,
    int WindDirection,
    int WeatherCode,
    bool IsDay,
    double? PrecipitationProbability,
    string Timezone);

public sealed record ProviderDailyForecast(
    DateOnly Date,
    int WeatherCode,
    double TemperatureMax,
    double TemperatureMin,
    int? PrecipitationProbability,
    DateTimeOffset? Sunrise,
    DateTimeOffset? Sunset,
    double WindSpeedMax);

public sealed record ProviderForecast(string Timezone, IReadOnlyList<ProviderDailyForecast> Days);
