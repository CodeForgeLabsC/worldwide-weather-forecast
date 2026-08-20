using WeatherDashboard.Application.Dtos;
using WeatherDashboard.Domain.ValueObjects;

namespace WeatherDashboard.Application.Abstractions;

/// <summary>
/// Application-facing weather API: consumed by controllers. Returns only application DTOs —
/// never provider-specific shapes.
/// </summary>
public interface IWeatherService
{
    Task<CurrentWeatherDto> GetCurrentWeatherAsync(Coordinates coordinates, CancellationToken cancellationToken);

    Task<ForecastDto> GetForecastAsync(Coordinates coordinates, int days, CancellationToken cancellationToken);
}
