using System.Text.Json.Serialization;

namespace WeatherDashboard.Infrastructure.Wikipedia;

internal sealed record WikipediaSummaryResponse(
    string? Title,
    string? Extract,
    WikipediaThumbnail? Thumbnail,
    [property: JsonPropertyName("content_urls")] WikipediaContentUrls? ContentUrls);

internal sealed record WikipediaThumbnail(string? Source);

internal sealed record WikipediaContentUrls(WikipediaPageUrl? Desktop);

internal sealed record WikipediaPageUrl(string? Page);
