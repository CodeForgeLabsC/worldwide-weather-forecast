using Microsoft.AspNetCore.Mvc;
using WeatherDashboard.Application.Abstractions;
using WeatherDashboard.Application.Dtos;
using WeatherDashboard.Application.Validation;

namespace WeatherDashboard.Api.Controllers;

[ApiController]
[Route("api/locations")]
public sealed class LocationsController : ControllerBase
{
    private readonly ILocationService _locationService;

    public LocationsController(ILocationService locationService)
    {
        _locationService = locationService;
    }

    [HttpGet("search")]
    [ProducesResponseType<IReadOnlyList<LocationSearchResultDto>>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<IReadOnlyList<LocationSearchResultDto>>> Search(
        [FromQuery] string q,
        CancellationToken cancellationToken)
    {
        if (!SearchQueryValidator.IsValid(q))
        {
            return ValidationProblem(
                $"q must be between {SearchQueryValidator.MinLength} and {SearchQueryValidator.MaxLength} characters.");
        }

        var results = await _locationService.SearchAsync(q.Trim(), cancellationToken);
        return Ok(results);
    }

    [HttpGet("presets")]
    [ProducesResponseType<IReadOnlyList<PresetLocationDto>>(StatusCodes.Status200OK)]
    public ActionResult<IReadOnlyList<PresetLocationDto>> Presets() => Ok(_locationService.GetPresets());

    [HttpGet("presets/{id}/cities")]
    [ProducesResponseType<IReadOnlyList<LocationSearchResultDto>>(StatusCodes.Status200OK)]
    public ActionResult<IReadOnlyList<LocationSearchResultDto>> PresetCities(string id) =>
        Ok(_locationService.GetCitiesForPreset(id));

    [HttpGet("facts")]
    [ProducesResponseType<CityFactsDto>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CityFactsDto>> Facts(
        [FromQuery] string name,
        [FromQuery] string? countryCode,
        CancellationToken cancellationToken)
    {
        if (!SearchQueryValidator.IsValid(name))
        {
            return ValidationProblem(
                $"name must be between {SearchQueryValidator.MinLength} and {SearchQueryValidator.MaxLength} characters.");
        }

        var facts = await _locationService.GetCityFactsAsync(name.Trim(), countryCode, cancellationToken);
        return Ok(facts);
    }
}
