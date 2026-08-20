using WeatherDashboard.Domain.Entities;
using WeatherDashboard.Domain.ValueObjects;

namespace WeatherDashboard.Application.Locations;

/// <summary>A curated handful of notable cities per <see cref="PresetLocations"/> entry, keyed by preset id.</summary>
public static class PresetCities
{
    public static readonly IReadOnlyDictionary<string, IReadOnlyList<GeoLocation>> ByPresetId =
        new Dictionary<string, IReadOnlyList<GeoLocation>>
        {
            ["california-us"] = new List<GeoLocation>
            {
                new("Los Angeles", "United States", "US", new Coordinates(34.0522, -118.2437), "America/Los_Angeles"),
                new("San Francisco", "United States", "US", new Coordinates(37.7749, -122.4194), "America/Los_Angeles"),
                new("San Diego", "United States", "US", new Coordinates(32.7157, -117.1611), "America/Los_Angeles"),
                new("Sacramento", "United States", "US", new Coordinates(38.5816, -121.4944), "America/Los_Angeles"),
                new("San Jose", "United States", "US", new Coordinates(37.3382, -121.8863), "America/Los_Angeles"),
                new("Oakland", "United States", "US", new Coordinates(37.8044, -122.2712), "America/Los_Angeles"),
            },
            ["poland"] = new List<GeoLocation>
            {
                new("Warsaw", "Poland", "PL", new Coordinates(52.2297, 21.0122), "Europe/Warsaw"),
                new("Kraków", "Poland", "PL", new Coordinates(50.0647, 19.9450), "Europe/Warsaw"),
                new("Gdańsk", "Poland", "PL", new Coordinates(54.3520, 18.6466), "Europe/Warsaw"),
                new("Wrocław", "Poland", "PL", new Coordinates(51.1079, 17.0385), "Europe/Warsaw"),
                new("Poznań", "Poland", "PL", new Coordinates(52.4064, 16.9252), "Europe/Warsaw"),
                new("Oświęcim", "Poland", "PL", new Coordinates(50.0343, 19.2210), "Europe/Warsaw"),
            },
            ["brazil"] = new List<GeoLocation>
            {
                new("São Paulo", "Brazil", "BR", new Coordinates(-23.5505, -46.6333), "America/Sao_Paulo"),
                new("Rio de Janeiro", "Brazil", "BR", new Coordinates(-22.9068, -43.1729), "America/Sao_Paulo"),
                new("Brasília", "Brazil", "BR", new Coordinates(-15.7939, -47.8828), "America/Sao_Paulo"),
                new("Salvador", "Brazil", "BR", new Coordinates(-12.9777, -38.5016), "America/Sao_Paulo"),
                new("Belo Horizonte", "Brazil", "BR", new Coordinates(-19.9167, -43.9345), "America/Sao_Paulo"),
                new("Fortaleza", "Brazil", "BR", new Coordinates(-3.7172, -38.5433), "America/Sao_Paulo"),
            },
            ["mexico"] = new List<GeoLocation>
            {
                new("Mexico City", "Mexico", "MX", new Coordinates(19.4326, -99.1332), "America/Mexico_City"),
                new("Guadalajara", "Mexico", "MX", new Coordinates(20.6597, -103.3496), "America/Mexico_City"),
                new("Monterrey", "Mexico", "MX", new Coordinates(25.6866, -100.3161), "America/Monterrey"),
                new("Cancún", "Mexico", "MX", new Coordinates(21.1619, -86.8515), "America/Cancun"),
                new("Puebla", "Mexico", "MX", new Coordinates(19.0414, -98.2063), "America/Mexico_City"),
                new("Tijuana", "Mexico", "MX", new Coordinates(32.5149, -117.0382), "America/Tijuana"),
            },
            ["japan"] = new List<GeoLocation>
            {
                new("Tokyo", "Japan", "JP", new Coordinates(35.6762, 139.6503), "Asia/Tokyo"),
                new("Osaka", "Japan", "JP", new Coordinates(34.6937, 135.5023), "Asia/Tokyo"),
                new("Kyoto", "Japan", "JP", new Coordinates(35.0116, 135.7681), "Asia/Tokyo"),
                new("Yokohama", "Japan", "JP", new Coordinates(35.4437, 139.6380), "Asia/Tokyo"),
                new("Sapporo", "Japan", "JP", new Coordinates(43.0618, 141.3545), "Asia/Tokyo"),
                new("Nagoya", "Japan", "JP", new Coordinates(35.1815, 136.9066), "Asia/Tokyo"),
            },
        };
}
