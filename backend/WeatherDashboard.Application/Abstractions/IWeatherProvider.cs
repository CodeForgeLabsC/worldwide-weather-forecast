using WeatherDashboard.Application.Weather;
using WeatherDashboard.Domain.ValueObjects;

namespace WeatherDashboard.Application.Abstractions;

/// <summary>
/// Boundary to an upstream weather data source. Implemented in Infrastructure
/// (e.g. <c>OpenMeteoWeatherProvider</c>); Application and API code depend only on this.
/// </summary>
public interface IWeatherProvider
{
    Task<ProviderCurrentWeather> GetCurrentWeatherAsync(Coordinates coordinates, CancellationToken cancellationToken);

    Task<ProviderForecast> GetForecastAsync(Coordinates coordinates, int days, CancellationToken cancellationToken);
}
