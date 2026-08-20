namespace WeatherDashboard.Infrastructure.OpenMeteo;

/// <summary>Strongly typed configuration for the Open-Meteo integration (bound from "OpenMeteo").</summary>
public sealed class OpenMeteoOptions
{
    public const string SectionName = "OpenMeteo";

    public required string ForecastBaseUrl { get; set; }

    public required string GeocodingBaseUrl { get; set; }

    public int TimeoutSeconds { get; set; } = 10;

    public int CacheDurationSeconds { get; set; } = 300;
}
