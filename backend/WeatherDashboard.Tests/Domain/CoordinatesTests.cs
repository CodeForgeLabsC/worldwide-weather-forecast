using WeatherDashboard.Domain.ValueObjects;

namespace WeatherDashboard.Tests.Domain;

public class CoordinatesTests
{
    [Theory]
    [InlineData(0, 0)]
    [InlineData(90, 180)]
    [InlineData(-90, -180)]
    [InlineData(52.2297, 21.0122)]
    public void Constructor_ValidRange_Succeeds(double lat, double lon)
    {
        var coordinates = new Coordinates(lat, lon);

        Assert.Equal(lat, coordinates.Latitude);
        Assert.Equal(lon, coordinates.Longitude);
    }

    [Theory]
    [InlineData(90.1, 0)]
    [InlineData(-90.1, 0)]
    [InlineData(0, 180.1)]
    [InlineData(0, -180.1)]
    public void Constructor_OutOfRange_Throws(double lat, double lon)
    {
        Assert.Throws<ArgumentOutOfRangeException>(() => new Coordinates(lat, lon));
    }

    [Fact]
    public void TryCreate_OutOfRange_ReturnsFalseInsteadOfThrowing()
    {
        var success = Coordinates.TryCreate(999, 0, out var coordinates);

        Assert.False(success);
        Assert.Equal(default, coordinates);
    }

    [Fact]
    public void ToCacheKey_NormalizesCoordinatesWithinRoundingPrecision()
    {
        var a = new Coordinates(52.22971, 21.01223);
        var b = new Coordinates(52.22969, 21.01221);

        Assert.Equal(a.ToCacheKey(), b.ToCacheKey());
    }
}
