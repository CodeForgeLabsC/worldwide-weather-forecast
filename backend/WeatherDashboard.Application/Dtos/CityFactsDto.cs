namespace WeatherDashboard.Application.Dtos;

public sealed record CityFactsDto(
    string Name,
    string? Country,
    long? Population,
    string? Summary,
    string? ThumbnailUrl,
    string? SourceUrl);
