using WeatherDashboard.Application.Abstractions;
using WeatherDashboard.Application.Dtos;
using WeatherDashboard.Domain.ValueObjects;
using WeatherDashboard.Domain.Weather;

namespace WeatherDashboard.Application.Weather;

public sealed class WeatherService : IWeatherService
{
    private readonly IWeatherProvider _weatherProvider;

    public WeatherService(IWeatherProvider weatherProvider)
    {
        _weatherProvider = weatherProvider;
    }

    public async Task<CurrentWeatherDto> GetCurrentWeatherAsync(Coordinates coordinates, CancellationToken cancellationToken)
    {
        var current = await _weatherProvider.GetCurrentWeatherAsync(coordinates, cancellationToken);
        var conditionInfo = WeatherCodeMapper.Map(current.WeatherCode);

        return new CurrentWeatherDto(
            new LocationDto(coordinates.Latitude, coordinates.Longitude, current.Timezone),
            current.Temperature,
            current.ApparentTemperature,
            current.Humidity,
            current.WindSpeed,
            current.WindDirection,
            current.WeatherCode,
            conditionInfo.Label,
            current.IsDay,
            current.PrecipitationProbability);
    }

    public async Task<ForecastDto> GetForecastAsync(Coordinates coordinates, int days, CancellationToken cancellationToken)
    {
        var forecast = await _weatherProvider.GetForecastAsync(coordinates, days, cancellationToken);

        var dailyDtos = forecast.Days
            .Select(day =>
            {
                var conditionInfo = WeatherCodeMapper.Map(day.WeatherCode);
                return new DailyForecastDto(
                    day.Date,
                    day.WeatherCode,
                    conditionInfo.Label,
                    day.TemperatureMax,
                    day.TemperatureMin,
                    day.PrecipitationProbability,
                    day.Sunrise,
                    day.Sunset,
                    day.WindSpeedMax);
            })
            .ToList();

        return new ForecastDto(
            new LocationDto(coordinates.Latitude, coordinates.Longitude, forecast.Timezone),
            dailyDtos);
    }
}
