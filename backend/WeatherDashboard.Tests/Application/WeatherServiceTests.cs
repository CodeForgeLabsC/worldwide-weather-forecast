using WeatherDashboard.Application.Weather;
using WeatherDashboard.Domain.Exceptions;
using WeatherDashboard.Domain.ValueObjects;
using WeatherDashboard.Tests.Fakes;

namespace WeatherDashboard.Tests.Application;

public class WeatherServiceTests
{
    private static readonly Coordinates Warsaw = new(52.2297, 21.0122);

    [Fact]
    public async Task GetCurrentWeatherAsync_MapsProviderDataToApplicationDto()
    {
        var provider = new FakeWeatherProvider();
        var sut = new WeatherService(provider);

        var result = await sut.GetCurrentWeatherAsync(Warsaw, CancellationToken.None);

        Assert.Equal(Warsaw.Latitude, result.Location.Latitude);
        Assert.Equal(Warsaw.Longitude, result.Location.Longitude);
        Assert.Equal("Europe/Warsaw", result.Location.Timezone);
        Assert.Equal(21.4, result.Temperature);
        Assert.Equal("Partly Cloudy", result.Condition);
        Assert.True(result.IsDay);
        Assert.Equal(20, result.PrecipitationProbability);
    }

    [Fact]
    public async Task GetCurrentWeatherAsync_UnknownWeatherCode_MapsToFallbackConditionInsteadOfThrowing()
    {
        var provider = new FakeWeatherProvider
        {
            CurrentWeatherFactory = _ => new ProviderCurrentWeather(
                Temperature: 10, ApparentTemperature: 9, Humidity: 50, WindSpeed: 5, WindDirection: 90,
                WeatherCode: 12345, IsDay: false, PrecipitationProbability: null, Timezone: "UTC"),
        };
        var sut = new WeatherService(provider);

        var result = await sut.GetCurrentWeatherAsync(Warsaw, CancellationToken.None);

        Assert.Equal("Cloudy", result.Condition);
        Assert.Null(result.PrecipitationProbability);
    }

    [Fact]
    public async Task GetForecastAsync_RequestingSevenDays_ReturnsExactlySevenEntries()
    {
        var provider = new FakeWeatherProvider();
        var sut = new WeatherService(provider);

        var result = await sut.GetForecastAsync(Warsaw, 7, CancellationToken.None);

        Assert.Equal(7, result.Days.Count);
    }

    [Fact]
    public async Task GetForecastAsync_MapsEachDayWeatherCodeToCondition()
    {
        var provider = new FakeWeatherProvider
        {
            ForecastFactory = (_, days) => new ProviderForecast(
                "Europe/Warsaw",
                [new ProviderDailyForecast(
                    DateOnly.FromDateTime(DateTime.Today), 95, 30, 20, 80,
                    DateTimeOffset.Now, DateTimeOffset.Now.AddHours(12), 40)]),
        };
        var sut = new WeatherService(provider);

        var result = await sut.GetForecastAsync(Warsaw, 1, CancellationToken.None);

        Assert.Single(result.Days);
        Assert.Equal("Thunderstorm", result.Days[0].Condition);
    }

    [Fact]
    public async Task GetCurrentWeatherAsync_ProviderThrows_PropagatesWeatherProviderException()
    {
        var provider = new FakeWeatherProvider { ExceptionToThrow = new WeatherProviderException("upstream failure") };
        var sut = new WeatherService(provider);

        await Assert.ThrowsAsync<WeatherProviderException>(() => sut.GetCurrentWeatherAsync(Warsaw, CancellationToken.None));
    }
}
