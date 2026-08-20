using WeatherDashboard.Application.Abstractions;
using WeatherDashboard.Application.Weather;
using WeatherDashboard.Domain.ValueObjects;

namespace WeatherDashboard.Tests.Fakes;

/// <summary>Hand-rolled test double so tests stay dependency-free.</summary>
public sealed class FakeWeatherProvider : IWeatherProvider
{
    public int CurrentWeatherCallCount { get; private set; }
    public int ForecastCallCount { get; private set; }

    public Func<Coordinates, ProviderCurrentWeather>? CurrentWeatherFactory { get; set; }
    public Func<Coordinates, int, ProviderForecast>? ForecastFactory { get; set; }
    public Exception? ExceptionToThrow { get; set; }

    public Task<ProviderCurrentWeather> GetCurrentWeatherAsync(Coordinates coordinates, CancellationToken cancellationToken)
    {
        CurrentWeatherCallCount++;

        if (ExceptionToThrow is not null)
        {
            throw ExceptionToThrow;
        }

        var result = CurrentWeatherFactory?.Invoke(coordinates) ?? new ProviderCurrentWeather(
            Temperature: 21.4,
            ApparentTemperature: 22.1,
            Humidity: 64,
            WindSpeed: 11.2,
            WindDirection: 240,
            WeatherCode: 2,
            IsDay: true,
            PrecipitationProbability: 20,
            Timezone: "Europe/Warsaw");

        return Task.FromResult(result);
    }

    public Task<ProviderForecast> GetForecastAsync(Coordinates coordinates, int days, CancellationToken cancellationToken)
    {
        ForecastCallCount++;

        if (ExceptionToThrow is not null)
        {
            throw ExceptionToThrow;
        }

        if (ForecastFactory is not null)
        {
            return Task.FromResult(ForecastFactory(coordinates, days));
        }

        var forecastDays = Enumerable.Range(0, days)
            .Select(i => new ProviderDailyForecast(
                Date: DateOnly.FromDateTime(DateTime.Today.AddDays(i)),
                WeatherCode: 2,
                TemperatureMax: 21,
                TemperatureMin: 13,
                PrecipitationProbability: 20,
                Sunrise: DateTimeOffset.Now,
                Sunset: DateTimeOffset.Now.AddHours(12),
                WindSpeedMax: 15))
            .ToList();

        return Task.FromResult(new ProviderForecast("Europe/Warsaw", forecastDays));
    }
}
