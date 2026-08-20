namespace WeatherDashboard.Application.Dtos;

public sealed record LocationSearchResultDto(
    string Name,
    string Country,
    string CountryCode,
    double Latitude,
    double Longitude,
    string Timezone,
    long? Population = null);

public sealed record PresetLocationDto(
    string Id,
    string Label,
    string City,
    string Country,
    string CountryCode,
    double Latitude,
    double Longitude,
    string Timezone);
