using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using WeatherDashboard.Application.Abstractions;
using WeatherDashboard.Application.Locations;

namespace WeatherDashboard.Infrastructure.Wikipedia;

/// <summary>
/// <see cref="IEncyclopediaProvider"/> implementation backed by the Wikipedia REST summary API.
/// A missing article (404) or an unreachable upstream both degrade to a null summary rather than
/// throwing — city facts are a "nice to have" enrichment, not core dashboard data, so one flaky
/// or absent article should never break the rest of the response.
/// </summary>
public sealed class WikipediaEncyclopediaProvider : IEncyclopediaProvider
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    private readonly HttpClient _httpClient;
    private readonly ILogger<WikipediaEncyclopediaProvider> _logger;

    public WikipediaEncyclopediaProvider(HttpClient httpClient, ILogger<WikipediaEncyclopediaProvider> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    public async Task<EncyclopediaSummary?> GetSummaryAsync(string title, CancellationToken cancellationToken)
    {
        var requestUri = $"api/rest_v1/page/summary/{Uri.EscapeDataString(title)}";

        try
        {
            using var response = await _httpClient.GetAsync(requestUri, cancellationToken);

            if (response.StatusCode == HttpStatusCode.NotFound)
            {
                return null;
            }

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning(
                    "Wikipedia summary request failed with status {StatusCode} for title {Title}",
                    response.StatusCode,
                    title);
                return null;
            }

            var payload = await response.Content.ReadFromJsonAsync<WikipediaSummaryResponse>(JsonOptions, cancellationToken);

            if (payload is null || string.IsNullOrWhiteSpace(payload.Extract))
            {
                return null;
            }

            return new EncyclopediaSummary(
                payload.Title ?? title,
                payload.Extract,
                payload.Thumbnail?.Source,
                payload.ContentUrls?.Desktop?.Page);
        }
        catch (Exception ex) when (ex is HttpRequestException or TaskCanceledException or JsonException)
        {
            _logger.LogWarning(ex, "Failed to reach Wikipedia for title {Title}", title);
            return null;
        }
    }
}
