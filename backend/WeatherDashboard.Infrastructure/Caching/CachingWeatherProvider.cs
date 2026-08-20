using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using WeatherDashboard.Application.Abstractions;
using WeatherDashboard.Application.Weather;
using WeatherDashboard.Domain.ValueObjects;
using WeatherDashboard.Infrastructure.OpenMeteo;

namespace WeatherDashboard.Infrastructure.Caching;

/// <summary>
/// Decorates an <see cref="IWeatherProvider"/> with a short-lived in-memory cache keyed by
/// normalized coordinates, so repeated requests for the same location within the cache window
/// do not re-hit the upstream provider.
/// </summary>
public sealed class CachingWeatherProvider : IWeatherProvider
{
    private readonly IWeatherProvider _inner;
    private readonly IMemoryCache _cache;
    private readonly ILogger<CachingWeatherProvider> _logger;
    private readonly TimeSpan _cacheDuration;

    public CachingWeatherProvider(
        IWeatherProvider inner,
        IMemoryCache cache,
        IOptions<OpenMeteoOptions> options,
        ILogger<CachingWeatherProvider> logger)
    {
        _inner = inner;
        _cache = cache;
        _logger = logger;
        _cacheDuration = TimeSpan.FromSeconds(options.Value.CacheDurationSeconds);
    }

    public Task<ProviderCurrentWeather> GetCurrentWeatherAsync(Coordinates coordinates, CancellationToken cancellationToken)
    {
        var key = $"current:{coordinates.ToCacheKey()}";
        return GetOrCreateAsync(key, () => _inner.GetCurrentWeatherAsync(coordinates, cancellationToken));
    }

    public Task<ProviderForecast> GetForecastAsync(Coordinates coordinates, int days, CancellationToken cancellationToken)
    {
        var key = $"forecast:{coordinates.ToCacheKey()}:{days}";
        return GetOrCreateAsync(key, () => _inner.GetForecastAsync(coordinates, days, cancellationToken));
    }

    private async Task<T> GetOrCreateAsync<T>(string key, Func<Task<T>> factory)
    {
        if (_cache.TryGetValue(key, out T? cached) && cached is not null)
        {
            _logger.LogDebug("Cache hit for {CacheKey}", key);
            return cached;
        }

        var value = await factory();
        _cache.Set(key, value, _cacheDuration);
        return value;
    }
}
