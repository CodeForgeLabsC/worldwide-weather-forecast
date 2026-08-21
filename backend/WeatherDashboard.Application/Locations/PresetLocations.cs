using WeatherDashboard.Domain.Entities;
using WeatherDashboard.Domain.ValueObjects;

namespace WeatherDashboard.Application.Locations;

/// <summary>The dashboard's initial curated shortcut locations, emphasizing Europe by default.</summary>
public static class PresetLocations
{
    public static readonly IReadOnlyList<PresetLocation> All = new List<PresetLocation>
    {
        new("california-us", "US", "Los Angeles", "United States", "US",
            new Coordinates(34.0522, -118.2437), "America/Los_Angeles"),
        new("poland", "Poland", "Warsaw", "Poland", "PL",
            new Coordinates(52.2297, 21.0122), "Europe/Warsaw"),
        new("brazil", "Brazil", "São Paulo", "Brazil", "BR",
            new Coordinates(-23.5505, -46.6333), "America/Sao_Paulo"),
        new("mexico", "Mexico", "Mexico City", "Mexico", "MX",
            new Coordinates(19.4326, -99.1332), "America/Mexico_City"),
        new("japan", "Japan", "Tokyo", "Japan", "JP",
            new Coordinates(35.6762, 139.6503), "Asia/Tokyo"),
    };
}
