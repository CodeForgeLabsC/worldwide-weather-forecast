using WeatherDashboard.Application.Abstractions;
using WeatherDashboard.Application.Dtos;

namespace WeatherDashboard.Application.Locations;

public sealed class LocationService : ILocationService
{
    private readonly IGeocodingProvider _geocodingProvider;
    private readonly IEncyclopediaProvider _encyclopediaProvider;

    public LocationService(IGeocodingProvider geocodingProvider, IEncyclopediaProvider encyclopediaProvider)
    {
        _geocodingProvider = geocodingProvider;
        _encyclopediaProvider = encyclopediaProvider;
    }

    public async Task<IReadOnlyList<LocationSearchResultDto>> SearchAsync(string query, CancellationToken cancellationToken)
    {
        var results = await _geocodingProvider.SearchAsync(query, cancellationToken);

        return results
            .Select(location => new LocationSearchResultDto(
                location.Name,
                location.Country,
                location.CountryCode,
                location.Coordinates.Latitude,
                location.Coordinates.Longitude,
                location.Timezone,
                location.Population))
            .ToList();
    }

    public IReadOnlyList<PresetLocationDto> GetPresets() =>
        PresetLocations.All
            .Select(preset => new PresetLocationDto(
                preset.Id,
                preset.Label,
                preset.City,
                preset.Country,
                preset.CountryCode,
                preset.Coordinates.Latitude,
                preset.Coordinates.Longitude,
                preset.Timezone))
            .ToList();

    public IReadOnlyList<LocationSearchResultDto> GetCitiesForPreset(string presetId) =>
        PresetCities.ByPresetId.TryGetValue(presetId, out var cities)
            ? cities
                .Select(city => new LocationSearchResultDto(
                    city.Name,
                    city.Country,
                    city.CountryCode,
                    city.Coordinates.Latitude,
                    city.Coordinates.Longitude,
                    city.Timezone,
                    city.Population))
                .ToList()
            : Array.Empty<LocationSearchResultDto>();

    public async Task<CityFactsDto> GetCityFactsAsync(string name, string? countryCode, CancellationToken cancellationToken)
    {
        var searchTask = _geocodingProvider.SearchAsync(name, cancellationToken);
        var summaryTask = _encyclopediaProvider.GetSummaryAsync(name, cancellationToken);

        await Task.WhenAll(searchTask, summaryTask);

        var matches = await searchTask;
        var summary = await summaryTask;

        var bestMatch = (countryCode is not null
            ? matches.FirstOrDefault(match => string.Equals(match.CountryCode, countryCode, StringComparison.OrdinalIgnoreCase))
            : null) ?? matches.FirstOrDefault();

        return new CityFactsDto(
            name,
            bestMatch?.Country,
            bestMatch?.Population,
            summary?.Extract,
            summary?.ThumbnailUrl,
            summary?.SourceUrl);
    }
}
