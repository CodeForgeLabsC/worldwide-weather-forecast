using WeatherDashboard.Application.Dtos;

namespace WeatherDashboard.Application.Abstractions;

public interface ILocationService
{
    Task<IReadOnlyList<LocationSearchResultDto>> SearchAsync(string query, CancellationToken cancellationToken);

    IReadOnlyList<PresetLocationDto> GetPresets();

    /// <summary>The curated cities for a given preset id, or an empty list for an unknown id.</summary>
    IReadOnlyList<LocationSearchResultDto> GetCitiesForPreset(string presetId);

    /// <summary>
    /// Best-effort enrichment for a place name: a population match from geocoding search plus an
    /// encyclopedic summary. Never throws for a "no data found" case — fields are simply null.
    /// </summary>
    Task<CityFactsDto> GetCityFactsAsync(string name, string? countryCode, CancellationToken cancellationToken);
}
