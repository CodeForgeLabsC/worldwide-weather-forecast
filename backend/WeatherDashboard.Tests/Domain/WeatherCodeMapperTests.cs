using WeatherDashboard.Domain.ValueObjects;
using WeatherDashboard.Domain.Weather;

namespace WeatherDashboard.Tests.Domain;

public class WeatherCodeMapperTests
{
    [Theory]
    [InlineData(0, WeatherCondition.Clear)]
    [InlineData(1, WeatherCondition.MostlyClear)]
    [InlineData(2, WeatherCondition.PartlyCloudy)]
    [InlineData(3, WeatherCondition.Cloudy)]
    [InlineData(45, WeatherCondition.Fog)]
    [InlineData(48, WeatherCondition.Fog)]
    [InlineData(51, WeatherCondition.Drizzle)]
    [InlineData(61, WeatherCondition.Rain)]
    [InlineData(65, WeatherCondition.HeavyRain)]
    [InlineData(71, WeatherCondition.Snow)]
    [InlineData(85, WeatherCondition.SnowShowers)]
    [InlineData(95, WeatherCondition.Thunderstorm)]
    [InlineData(99, WeatherCondition.Thunderstorm)]
    public void Map_KnownWmoCode_ReturnsExpectedCondition(int code, WeatherCondition expected)
    {
        var result = WeatherCodeMapper.Map(code);

        Assert.Equal(expected, result.Condition);
        Assert.False(string.IsNullOrWhiteSpace(result.Label));
    }

    [Fact]
    public void Map_UnknownCode_FallsBackToCloudyRatherThanThrowing()
    {
        var result = WeatherCodeMapper.Map(-1);

        Assert.Equal(WeatherCondition.Cloudy, result.Condition);
    }
}
