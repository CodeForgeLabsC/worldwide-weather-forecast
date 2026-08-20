using WeatherDashboard.Domain.ValueObjects;

namespace WeatherDashboard.Domain.Weather;

/// <summary>
/// Translates WMO weather interpretation codes (the standard used by Open-Meteo and most
/// meteorological providers) into application-level conditions. This is the single source of
/// truth for weather-code semantics; no other layer should branch on raw numeric codes.
/// </summary>
public static class WeatherCodeMapper
{
    private static readonly Dictionary<int, WeatherConditionInfo> CodeMap = new()
    {
        [0] = new WeatherConditionInfo(WeatherCondition.Clear, "Clear"),
        [1] = new WeatherConditionInfo(WeatherCondition.MostlyClear, "Mostly Clear"),
        [2] = new WeatherConditionInfo(WeatherCondition.PartlyCloudy, "Partly Cloudy"),
        [3] = new WeatherConditionInfo(WeatherCondition.Cloudy, "Cloudy"),
        [45] = new WeatherConditionInfo(WeatherCondition.Fog, "Fog"),
        [48] = new WeatherConditionInfo(WeatherCondition.Fog, "Rime Fog"),
        [51] = new WeatherConditionInfo(WeatherCondition.Drizzle, "Light Drizzle"),
        [53] = new WeatherConditionInfo(WeatherCondition.Drizzle, "Drizzle"),
        [55] = new WeatherConditionInfo(WeatherCondition.Drizzle, "Dense Drizzle"),
        [56] = new WeatherConditionInfo(WeatherCondition.Drizzle, "Freezing Drizzle"),
        [57] = new WeatherConditionInfo(WeatherCondition.Drizzle, "Dense Freezing Drizzle"),
        [61] = new WeatherConditionInfo(WeatherCondition.Rain, "Light Rain"),
        [63] = new WeatherConditionInfo(WeatherCondition.Rain, "Rain"),
        [65] = new WeatherConditionInfo(WeatherCondition.HeavyRain, "Heavy Rain"),
        [66] = new WeatherConditionInfo(WeatherCondition.HeavyRain, "Freezing Rain"),
        [67] = new WeatherConditionInfo(WeatherCondition.HeavyRain, "Heavy Freezing Rain"),
        [71] = new WeatherConditionInfo(WeatherCondition.Snow, "Light Snow"),
        [73] = new WeatherConditionInfo(WeatherCondition.Snow, "Snow"),
        [75] = new WeatherConditionInfo(WeatherCondition.Snow, "Heavy Snow"),
        [77] = new WeatherConditionInfo(WeatherCondition.Snow, "Snow Grains"),
        [80] = new WeatherConditionInfo(WeatherCondition.Rain, "Light Rain Showers"),
        [81] = new WeatherConditionInfo(WeatherCondition.Rain, "Rain Showers"),
        [82] = new WeatherConditionInfo(WeatherCondition.HeavyRain, "Violent Rain Showers"),
        [85] = new WeatherConditionInfo(WeatherCondition.SnowShowers, "Snow Showers"),
        [86] = new WeatherConditionInfo(WeatherCondition.SnowShowers, "Heavy Snow Showers"),
        [95] = new WeatherConditionInfo(WeatherCondition.Thunderstorm, "Thunderstorm"),
        [96] = new WeatherConditionInfo(WeatherCondition.Thunderstorm, "Thunderstorm with Hail"),
        [99] = new WeatherConditionInfo(WeatherCondition.Thunderstorm, "Severe Thunderstorm"),
    };

    private static readonly WeatherConditionInfo Fallback = new(WeatherCondition.Cloudy, "Cloudy");

    public static WeatherConditionInfo Map(int weatherCode) =>
        CodeMap.TryGetValue(weatherCode, out var info) ? info : Fallback;
}
