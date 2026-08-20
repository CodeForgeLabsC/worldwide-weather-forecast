namespace WeatherDashboard.Application.Dtos;

public sealed record DailyForecastDto(
    DateOnly Date,
    int WeatherCode,
    string Condition,
    double TemperatureMax,
    double TemperatureMin,
    int? PrecipitationProbability,
    DateTimeOffset? Sunrise,
    DateTimeOffset? Sunset,
    double WindSpeedMax);

public sealed record ForecastDto(LocationDto Location, IReadOnlyList<DailyForecastDto> Days);
