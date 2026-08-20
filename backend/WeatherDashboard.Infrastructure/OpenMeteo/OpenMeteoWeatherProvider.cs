using System.Globalization;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using WeatherDashboard.Application.Abstractions;
using WeatherDashboard.Application.Weather;
using WeatherDashboard.Domain.Exceptions;
using WeatherDashboard.Domain.ValueObjects;

namespace WeatherDashboard.Infrastructure.OpenMeteo;

/// <summary>
/// <see cref="IWeatherProvider"/> implementation backed by the Open-Meteo forecast API.
/// This is the only place in the codebase aware of Open-Meteo's request/response shape.
/// </summary>
public sealed class OpenMeteoWeatherProvider : IWeatherProvider
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    private readonly HttpClient _httpClient;
    private readonly ILogger<OpenMeteoWeatherProvider> _logger;

    public OpenMeteoWeatherProvider(HttpClient httpClient, ILogger<OpenMeteoWeatherProvider> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    public async Task<ProviderCurrentWeather> GetCurrentWeatherAsync(Coordinates coordinates, CancellationToken cancellationToken)
    {
        var requestUri =
            "v1/forecast" +
            $"?latitude={coordinates.Latitude.ToString(CultureInfo.InvariantCulture)}" +
            $"&longitude={coordinates.Longitude.ToString(CultureInfo.InvariantCulture)}" +
            "&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,wind_direction_10m" +
            "&hourly=precipitation_probability" +
            "&forecast_days=1" +
            "&timezone=auto";

        var response = await FetchAsync(requestUri, cancellationToken);

        if (response.Current is null)
        {
            throw new WeatherProviderException("Open-Meteo response did not include current weather data.");
        }

        var current = response.Current;
        var precipitationProbability = FindHourlyPrecipitationProbability(response.Hourly, current.Time);

        return new ProviderCurrentWeather(
            Temperature: current.Temperature2m,
            ApparentTemperature: current.ApparentTemperature,
            Humidity: current.RelativeHumidity2m,
            WindSpeed: current.WindSpeed10m,
            WindDirection: current.WindDirection10m,
            WeatherCode: current.WeatherCode,
            IsDay: current.IsDay == 1,
            PrecipitationProbability: precipitationProbability,
            Timezone: response.Timezone);
    }

    public async Task<ProviderForecast> GetForecastAsync(Coordinates coordinates, int days, CancellationToken cancellationToken)
    {
        var clampedDays = Math.Clamp(days, 1, 16);

        var requestUri =
            "v1/forecast" +
            $"?latitude={coordinates.Latitude.ToString(CultureInfo.InvariantCulture)}" +
            $"&longitude={coordinates.Longitude.ToString(CultureInfo.InvariantCulture)}" +
            "&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,wind_speed_10m_max" +
            $"&forecast_days={clampedDays}" +
            "&timezone=auto";

        var response = await FetchAsync(requestUri, cancellationToken);

        if (response.Daily?.Time is null)
        {
            throw new WeatherProviderException("Open-Meteo response did not include daily forecast data.");
        }

        var daily = response.Daily;
        var offset = TimeSpan.FromSeconds(response.UtcOffsetSeconds);
        var dayCount = daily.Time.Count;
        var dailyForecasts = new List<ProviderDailyForecast>(dayCount);

        for (var i = 0; i < dayCount; i++)
        {
            dailyForecasts.Add(new ProviderDailyForecast(
                Date: DateOnly.Parse(daily.Time[i], CultureInfo.InvariantCulture),
                WeatherCode: GetAt(daily.WeatherCode, i, 0),
                TemperatureMax: GetAt(daily.TemperatureMax, i, 0d),
                TemperatureMin: GetAt(daily.TemperatureMin, i, 0d),
                PrecipitationProbability: GetAt(daily.PrecipitationProbabilityMax, i, null),
                Sunrise: ParseLocalDateTime(GetAt(daily.Sunrise, i, null), offset),
                Sunset: ParseLocalDateTime(GetAt(daily.Sunset, i, null), offset),
                WindSpeedMax: GetAt(daily.WindSpeedMax, i, 0d)));
        }

        return new ProviderForecast(response.Timezone, dailyForecasts);
    }

    private async Task<OpenMeteoForecastResponse> FetchAsync(string requestUri, CancellationToken cancellationToken)
    {
        try
        {
            using var response = await _httpClient.GetAsync(requestUri, cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning(
                    "Open-Meteo forecast request failed with status {StatusCode} for {RequestUri}",
                    response.StatusCode,
                    requestUri);
                throw new WeatherProviderException($"Weather provider returned status {(int)response.StatusCode}.");
            }

            var payload = await response.Content.ReadFromJsonAsync<OpenMeteoForecastResponse>(JsonOptions, cancellationToken);

            return payload ?? throw new WeatherProviderException("Weather provider returned an empty response.");
        }
        catch (WeatherProviderException)
        {
            throw;
        }
        catch (Exception ex) when (ex is HttpRequestException or TaskCanceledException or JsonException)
        {
            _logger.LogError(ex, "Failed to reach the Open-Meteo forecast API for {RequestUri}", requestUri);
            throw new WeatherProviderException("Unable to reach the weather provider.", ex);
        }
    }

    private static int? FindHourlyPrecipitationProbability(OpenMeteoHourly? hourly, string currentTimeIso)
    {
        if (hourly?.Time is null || hourly.PrecipitationProbability is null)
        {
            return null;
        }

        if (!DateTime.TryParse(currentTimeIso, CultureInfo.InvariantCulture, DateTimeStyles.None, out var currentTime))
        {
            return null;
        }

        var flooredHour = new DateTime(currentTime.Year, currentTime.Month, currentTime.Day, currentTime.Hour, 0, 0, DateTimeKind.Unspecified);
        var targetKey = flooredHour.ToString("yyyy-MM-ddTHH:mm", CultureInfo.InvariantCulture);

        var index = hourly.Time.IndexOf(targetKey);

        return index >= 0 && index < hourly.PrecipitationProbability.Count
            ? hourly.PrecipitationProbability[index]
            : null;
    }

    private static DateTimeOffset? ParseLocalDateTime(string? isoLocal, TimeSpan offset)
    {
        if (string.IsNullOrEmpty(isoLocal))
        {
            return null;
        }

        return DateTime.TryParse(isoLocal, CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsed)
            ? new DateTimeOffset(DateTime.SpecifyKind(parsed, DateTimeKind.Unspecified), offset)
            : null;
    }

    private static T GetAt<T>(List<T>? list, int index, T fallback) =>
        list is not null && index < list.Count ? list[index] : fallback;
}
