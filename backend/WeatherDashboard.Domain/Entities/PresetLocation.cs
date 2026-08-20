using WeatherDashboard.Domain.ValueObjects;

namespace WeatherDashboard.Domain.Entities;

/// <summary>A curated shortcut location shown in the dashboard's navigation.</summary>
public sealed record PresetLocation(
    string Id,
    string Label,
    string City,
    string Country,
    string CountryCode,
    Coordinates Coordinates,
    string Timezone);
