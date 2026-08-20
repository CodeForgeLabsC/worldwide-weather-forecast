using System.Text.Json.Serialization;

namespace WeatherDashboard.Infrastructure.OpenMeteo;

/// <summary>
/// Raw Open-Meteo forecast API response shape. Internal to Infrastructure — never exposed
/// outside this assembly. See https://open-meteo.com/en/docs for field semantics.
/// </summary>
internal sealed record OpenMeteoForecastResponse(
    double Latitude,
    double Longitude,
    string Timezone,
    [property: JsonPropertyName("utc_offset_seconds")] int UtcOffsetSeconds,
    OpenMeteoCurrent? Current,
    OpenMeteoHourly? Hourly,
    OpenMeteoDaily? Daily);

internal sealed record OpenMeteoCurrent(
    string Time,
    [property: JsonPropertyName("temperature_2m")] double Temperature2m,
    [property: JsonPropertyName("relative_humidity_2m")] int RelativeHumidity2m,
    [property: JsonPropertyName("apparent_temperature")] double ApparentTemperature,
    [property: JsonPropertyName("is_day")] int IsDay,
    [property: JsonPropertyName("weather_code")] int WeatherCode,
    [property: JsonPropertyName("wind_speed_10m")] double WindSpeed10m,
    [property: JsonPropertyName("wind_direction_10m")] int WindDirection10m);

internal sealed record OpenMeteoHourly(
    List<string>? Time,
    [property: JsonPropertyName("precipitation_probability")] List<int?>? PrecipitationProbability);

internal sealed record OpenMeteoDaily(
    List<string>? Time,
    [property: JsonPropertyName("weather_code")] List<int>? WeatherCode,
    [property: JsonPropertyName("temperature_2m_max")] List<double>? TemperatureMax,
    [property: JsonPropertyName("temperature_2m_min")] List<double>? TemperatureMin,
    List<string?>? Sunrise,
    List<string?>? Sunset,
    [property: JsonPropertyName("precipitation_probability_max")] List<int?>? PrecipitationProbabilityMax,
    [property: JsonPropertyName("wind_speed_10m_max")] List<double>? WindSpeedMax);
