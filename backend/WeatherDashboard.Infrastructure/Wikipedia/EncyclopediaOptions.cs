namespace WeatherDashboard.Infrastructure.Wikipedia;

/// <summary>Strongly typed configuration for the Wikipedia integration (bound from "Encyclopedia").</summary>
public sealed class EncyclopediaOptions
{
    public const string SectionName = "Encyclopedia";

    public required string BaseUrl { get; set; }

    public int TimeoutSeconds { get; set; } = 10;
}
