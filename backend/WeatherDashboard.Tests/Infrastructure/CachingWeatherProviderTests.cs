using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using WeatherDashboard.Domain.Exceptions;
using WeatherDashboard.Domain.ValueObjects;
using WeatherDashboard.Infrastructure.Caching;
using WeatherDashboard.Infrastructure.OpenMeteo;
using WeatherDashboard.Tests.Fakes;

namespace WeatherDashboard.Tests.Infrastructure;

public class CachingWeatherProviderTests
{
    private static CachingWeatherProvider CreateSut(FakeWeatherProvider inner, int cacheDurationSeconds = 300) =>
        new(
            inner,
            new MemoryCache(new MemoryCacheOptions()),
            Options.Create(new OpenMeteoOptions
            {
                ForecastBaseUrl = "https://api.open-meteo.com/",
                GeocodingBaseUrl = "https://geocoding-api.open-meteo.com/",
                CacheDurationSeconds = cacheDurationSeconds,
            }),
            NullLogger<CachingWeatherProvider>.Instance);

    [Fact]
    public async Task GetCurrentWeatherAsync_SecondCallForSameCoordinates_ServedFromCache()
    {
        var inner = new FakeWeatherProvider();
        var sut = CreateSut(inner);
        var coordinates = new Coordinates(52.2297, 21.0122);

        await sut.GetCurrentWeatherAsync(coordinates, CancellationToken.None);
        await sut.GetCurrentWeatherAsync(coordinates, CancellationToken.None);

        Assert.Equal(1, inner.CurrentWeatherCallCount);
    }

    [Fact]
    public async Task GetCurrentWeatherAsync_DifferentCoordinates_BypassesCache()
    {
        var inner = new FakeWeatherProvider();
        var sut = CreateSut(inner);

        await sut.GetCurrentWeatherAsync(new Coordinates(52.2297, 21.0122), CancellationToken.None);
        await sut.GetCurrentWeatherAsync(new Coordinates(35.6762, 139.6503), CancellationToken.None);

        Assert.Equal(2, inner.CurrentWeatherCallCount);
    }

    [Fact]
    public async Task GetCurrentWeatherAsync_CoordinatesDifferingOnlyByRoundingNoise_HitCache()
    {
        var inner = new FakeWeatherProvider();
        var sut = CreateSut(inner);

        await sut.GetCurrentWeatherAsync(new Coordinates(52.22971, 21.01221), CancellationToken.None);
        await sut.GetCurrentWeatherAsync(new Coordinates(52.22969, 21.01219), CancellationToken.None);

        Assert.Equal(1, inner.CurrentWeatherCallCount);
    }

    [Fact]
    public async Task GetForecastAsync_DifferentDayCounts_TreatedAsDistinctCacheEntries()
    {
        var inner = new FakeWeatherProvider();
        var sut = CreateSut(inner);
        var coordinates = new Coordinates(52.2297, 21.0122);

        await sut.GetForecastAsync(coordinates, 7, CancellationToken.None);
        await sut.GetForecastAsync(coordinates, 3, CancellationToken.None);

        Assert.Equal(2, inner.ForecastCallCount);
    }

    [Fact]
    public async Task GetCurrentWeatherAsync_ProviderFailure_IsNotCached()
    {
        var inner = new FakeWeatherProvider { ExceptionToThrow = new WeatherProviderException("boom") };
        var sut = CreateSut(inner);
        var coordinates = new Coordinates(52.2297, 21.0122);

        await Assert.ThrowsAsync<WeatherProviderException>(() => sut.GetCurrentWeatherAsync(coordinates, CancellationToken.None));
        await Assert.ThrowsAsync<WeatherProviderException>(() => sut.GetCurrentWeatherAsync(coordinates, CancellationToken.None));

        Assert.Equal(2, inner.CurrentWeatherCallCount);
    }
}
