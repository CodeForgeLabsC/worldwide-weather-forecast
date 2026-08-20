using WeatherDashboard.Domain.ValueObjects;

namespace WeatherDashboard.Domain.Entities;

/// <summary>A resolved place: the result of a geocoding search.</summary>
public sealed record GeoLocation(
    string Name,
    string Country,
    string CountryCode,
    Coordinates Coordinates,
    string Timezone,
    long? Population = null);
