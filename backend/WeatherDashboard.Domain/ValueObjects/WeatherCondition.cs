namespace WeatherDashboard.Domain.ValueObjects;

/// <summary>
/// Application-level weather condition, decoupled from any specific provider's coding scheme.
/// </summary>
public enum WeatherCondition
{
    Clear,
    MostlyClear,
    PartlyCloudy,
    Cloudy,
    Fog,
    Drizzle,
    Rain,
    HeavyRain,
    Snow,
    SnowShowers,
    Thunderstorm
}
