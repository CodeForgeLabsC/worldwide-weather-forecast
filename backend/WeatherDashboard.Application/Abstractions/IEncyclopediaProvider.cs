using WeatherDashboard.Application.Locations;

namespace WeatherDashboard.Application.Abstractions;

/// <summary>
/// Boundary to an upstream encyclopedic-summary data source. Unlike <see cref="IWeatherProvider"/>
/// and <see cref="IGeocodingProvider"/>, a missing or unreachable summary is not exceptional —
/// most places simply don't have an article — so implementations return null rather than throw.
/// </summary>
public interface IEncyclopediaProvider
{
    Task<EncyclopediaSummary?> GetSummaryAsync(string title, CancellationToken cancellationToken);
}
