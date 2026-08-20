namespace WeatherDashboard.Application.Locations;

/// <summary>A short encyclopedic summary of a place, sourced from an <see cref="Abstractions.IEncyclopediaProvider"/>.</summary>
public sealed record EncyclopediaSummary(
    string Title,
    string? Extract,
    string? ThumbnailUrl,
    string? SourceUrl);
