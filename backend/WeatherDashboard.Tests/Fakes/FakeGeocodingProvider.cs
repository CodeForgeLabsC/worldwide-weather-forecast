using WeatherDashboard.Application.Abstractions;
using WeatherDashboard.Domain.Entities;

namespace WeatherDashboard.Tests.Fakes;

public sealed class FakeGeocodingProvider : IGeocodingProvider
{
    public IReadOnlyList<GeoLocation> Results { get; set; } = [];
    public string? LastQuery { get; private set; }
    public Exception? ExceptionToThrow { get; set; }

    public Task<IReadOnlyList<GeoLocation>> SearchAsync(string query, CancellationToken cancellationToken)
    {
        LastQuery = query;

        if (ExceptionToThrow is not null)
        {
            throw ExceptionToThrow;
        }

        return Task.FromResult(Results);
    }
}
