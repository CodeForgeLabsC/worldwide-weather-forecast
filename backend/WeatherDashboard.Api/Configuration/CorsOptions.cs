namespace WeatherDashboard.Api.Configuration;

/// <summary>Strongly typed CORS configuration (bound from the "Cors" section).</summary>
public sealed class CorsOptions
{
    public const string SectionName = "Cors";

    public string[] AllowedOrigins { get; set; } = [];
}
