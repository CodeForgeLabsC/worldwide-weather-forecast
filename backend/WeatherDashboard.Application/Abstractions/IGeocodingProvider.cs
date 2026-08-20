using WeatherDashboard.Domain.Entities;

namespace WeatherDashboard.Application.Abstractions;

/// <summary>Boundary to an upstream geocoding/place-search data source.</summary>
public interface IGeocodingProvider
{
    Task<IReadOnlyList<GeoLocation>> SearchAsync(string query, CancellationToken cancellationToken);
}
