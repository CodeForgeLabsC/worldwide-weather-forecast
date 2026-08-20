using System.Text.Json.Serialization;

namespace WeatherDashboard.Infrastructure.OpenMeteo;

internal sealed record OpenMeteoGeocodingResponse(List<OpenMeteoGeocodingResult>? Results);

internal sealed record OpenMeteoGeocodingResult(
    string Name,
    double Latitude,
    double Longitude,
    string? Country,
    [property: JsonPropertyName("country_code")] string? CountryCode,
    string? Timezone,
    long? Population);
