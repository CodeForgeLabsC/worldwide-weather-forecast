using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using WeatherDashboard.Application.Abstractions;
using WeatherDashboard.Domain.Entities;
using WeatherDashboard.Domain.Exceptions;
using WeatherDashboard.Domain.ValueObjects;

namespace WeatherDashboard.Infrastructure.OpenMeteo;

/// <summary>
/// <see cref="IGeocodingProvider"/> implementation backed by the Open-Meteo geocoding API.
/// </summary>
public sealed class OpenMeteoGeocodingProvider : IGeocodingProvider
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    private readonly HttpClient _httpClient;
    private readonly ILogger<OpenMeteoGeocodingProvider> _logger;

    public OpenMeteoGeocodingProvider(HttpClient httpClient, ILogger<OpenMeteoGeocodingProvider> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    public async Task<IReadOnlyList<GeoLocation>> SearchAsync(string query, CancellationToken cancellationToken)
    {
        var requestUri = $"v1/search?name={Uri.EscapeDataString(query)}&count=10&language=en&format=json";

        try
        {
            using var response = await _httpClient.GetAsync(requestUri, cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning(
                    "Open-Meteo geocoding request failed with status {StatusCode} for query {Query}",
                    response.StatusCode,
                    query);
                throw new WeatherProviderException($"Location search provider returned status {(int)response.StatusCode}.");
            }

            var payload = await response.Content.ReadFromJsonAsync<OpenMeteoGeocodingResponse>(JsonOptions, cancellationToken);

            if (payload?.Results is null)
            {
                return Array.Empty<GeoLocation>();
            }

            var locations = new List<GeoLocation>(payload.Results.Count);

            foreach (var result in payload.Results)
            {
                if (!Coordinates.TryCreate(result.Latitude, result.Longitude, out var coordinates))
                {
                    continue;
                }

                locations.Add(new GeoLocation(
                    result.Name,
                    result.Country ?? string.Empty,
                    result.CountryCode ?? string.Empty,
                    coordinates,
                    result.Timezone ?? "UTC",
                    result.Population));
            }

            return locations;
        }
        catch (WeatherProviderException)
        {
            throw;
        }
        catch (Exception ex) when (ex is HttpRequestException or TaskCanceledException or JsonException)
        {
            _logger.LogError(ex, "Failed to reach the Open-Meteo geocoding API for query {Query}", query);
            throw new WeatherProviderException("Unable to reach the location search provider.", ex);
        }
    }
}
