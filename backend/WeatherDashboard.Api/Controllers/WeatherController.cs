using Microsoft.AspNetCore.Mvc;
using WeatherDashboard.Application.Abstractions;
using WeatherDashboard.Application.Dtos;
using WeatherDashboard.Application.Validation;
using WeatherDashboard.Domain.ValueObjects;

namespace WeatherDashboard.Api.Controllers;

[ApiController]
[Route("api/weather")]
public sealed class WeatherController : ControllerBase
{
    private readonly IWeatherService _weatherService;

    public WeatherController(IWeatherService weatherService)
    {
        _weatherService = weatherService;
    }

    [HttpGet("current")]
    [ProducesResponseType<CurrentWeatherDto>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CurrentWeatherDto>> GetCurrent(
        [FromQuery] double lat,
        [FromQuery] double lon,
        CancellationToken cancellationToken)
    {
        if (!Coordinates.TryCreate(lat, lon, out var coordinates))
        {
            return ValidationProblem("Latitude must be between -90 and 90, and longitude between -180 and 180.");
        }

        var result = await _weatherService.GetCurrentWeatherAsync(coordinates, cancellationToken);
        return Ok(result);
    }

    [HttpGet("forecast")]
    [ProducesResponseType<ForecastDto>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ForecastDto>> GetForecast(
        [FromQuery] double lat,
        [FromQuery] double lon,
        [FromQuery] int days,
        CancellationToken cancellationToken)
    {
        if (!Coordinates.TryCreate(lat, lon, out var coordinates))
        {
            return ValidationProblem("Latitude must be between -90 and 90, and longitude between -180 and 180.");
        }

        var requestedDays = days == 0 ? 7 : days;

        if (!ForecastDaysValidator.IsValid(requestedDays))
        {
            return ValidationProblem(
                $"days must be between {ForecastDaysValidator.MinDays} and {ForecastDaysValidator.MaxDays}.");
        }

        var result = await _weatherService.GetForecastAsync(coordinates, requestedDays, cancellationToken);
        return Ok(result);
    }
}
