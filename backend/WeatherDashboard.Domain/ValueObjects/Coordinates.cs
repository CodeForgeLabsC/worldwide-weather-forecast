namespace WeatherDashboard.Domain.ValueObjects;

/// <summary>
/// A validated latitude/longitude pair. Construction is the single enforcement point
/// for coordinate range validation across the application.
/// </summary>
public readonly record struct Coordinates
{
    public double Latitude { get; }
    public double Longitude { get; }

    public Coordinates(double latitude, double longitude)
    {
        if (latitude is < -90 or > 90)
        {
            throw new ArgumentOutOfRangeException(nameof(latitude), latitude, "Latitude must be between -90 and 90.");
        }

        if (longitude is < -180 or > 180)
        {
            throw new ArgumentOutOfRangeException(nameof(longitude), longitude, "Longitude must be between -180 and 180.");
        }

        Latitude = latitude;
        Longitude = longitude;
    }

    public static bool TryCreate(double latitude, double longitude, out Coordinates coordinates)
    {
        if (latitude is < -90 or > 90 || longitude is < -180 or > 180)
        {
            coordinates = default;
            return false;
        }

        coordinates = new Coordinates(latitude, longitude);
        return true;
    }

    /// <summary>Rounded representation suitable for cache-key normalization.</summary>
    public string ToCacheKey(int decimals = 3) =>
        $"{Math.Round(Latitude, decimals).ToString(System.Globalization.CultureInfo.InvariantCulture)}," +
        $"{Math.Round(Longitude, decimals).ToString(System.Globalization.CultureInfo.InvariantCulture)}";
}
