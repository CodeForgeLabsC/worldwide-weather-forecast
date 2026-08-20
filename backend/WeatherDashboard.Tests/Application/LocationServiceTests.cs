using WeatherDashboard.Application.Locations;
using WeatherDashboard.Domain.Entities;
using WeatherDashboard.Domain.ValueObjects;
using WeatherDashboard.Tests.Fakes;

namespace WeatherDashboard.Tests.Application;

public class LocationServiceTests
{
    private static LocationService CreateSut(
        FakeGeocodingProvider? geocodingProvider = null,
        FakeEncyclopediaProvider? encyclopediaProvider = null) =>
        new(geocodingProvider ?? new FakeGeocodingProvider(), encyclopediaProvider ?? new FakeEncyclopediaProvider());

    [Fact]
    public async Task SearchAsync_MapsGeoLocationsToDtos()
    {
        var provider = new FakeGeocodingProvider
        {
            Results =
            [
                new GeoLocation("Warsaw", "Poland", "PL", new Coordinates(52.2297, 21.0122), "Europe/Warsaw", 1_861_975),
            ],
        };
        var sut = CreateSut(provider);

        var results = await sut.SearchAsync("Warsaw", CancellationToken.None);

        var result = Assert.Single(results);
        Assert.Equal("Warsaw", result.Name);
        Assert.Equal("PL", result.CountryCode);
        Assert.Equal("Europe/Warsaw", result.Timezone);
        Assert.Equal(1_861_975, result.Population);
    }

    [Fact]
    public void GetPresets_ReturnsAllFiveRequiredShortcuts()
    {
        var sut = CreateSut();

        var presets = sut.GetPresets();

        Assert.Equal(5, presets.Count);
        Assert.Contains(presets, p => p.Id == "poland" && p.City == "Warsaw");
        Assert.Contains(presets, p => p.Id == "california-us" && p.City == "Los Angeles");
        Assert.Contains(presets, p => p.Id == "brazil" && p.City == "São Paulo");
        Assert.Contains(presets, p => p.Id == "mexico" && p.City == "Mexico City");
        Assert.Contains(presets, p => p.Id == "japan" && p.City == "Tokyo");
    }

    [Fact]
    public void GetCitiesForPreset_Poland_IncludesOswiecim()
    {
        var sut = CreateSut();

        var cities = sut.GetCitiesForPreset("poland");

        Assert.Contains(cities, c => c.Name == "Oświęcim" && c.CountryCode == "PL");
    }

    [Fact]
    public void GetCitiesForPreset_UnknownPresetId_ReturnsEmptyList()
    {
        var sut = CreateSut();

        var cities = sut.GetCitiesForPreset("not-a-real-preset");

        Assert.Empty(cities);
    }

    [Fact]
    public async Task GetCityFactsAsync_CombinesPopulationAndSummary()
    {
        var geocoding = new FakeGeocodingProvider
        {
            Results =
            [
                new GeoLocation("Oświęcim", "Poland", "PL", new Coordinates(50.0343, 19.2210), "Europe/Warsaw", 34_170),
            ],
        };
        var encyclopedia = new FakeEncyclopediaProvider
        {
            Summary = new EncyclopediaSummary("Oświęcim", "A town in southern Poland.", null, "https://en.wikipedia.org/wiki/O%C5%9Bwi%C4%99cim"),
        };
        var sut = CreateSut(geocoding, encyclopedia);

        var facts = await sut.GetCityFactsAsync("Oświęcim", "PL", CancellationToken.None);

        Assert.Equal("Poland", facts.Country);
        Assert.Equal(34_170, facts.Population);
        Assert.Equal("A town in southern Poland.", facts.Summary);
        Assert.Equal("https://en.wikipedia.org/wiki/O%C5%9Bwi%C4%99cim", facts.SourceUrl);
    }

    [Fact]
    public async Task GetCityFactsAsync_NoWikipediaArticle_DegradesGracefullyInsteadOfThrowing()
    {
        var geocoding = new FakeGeocodingProvider
        {
            Results = [new GeoLocation("Nowhere", "Testland", "TL", new Coordinates(0, 0), "UTC", 42)],
        };
        var encyclopedia = new FakeEncyclopediaProvider { Summary = null };
        var sut = CreateSut(geocoding, encyclopedia);

        var facts = await sut.GetCityFactsAsync("Nowhere", "TL", CancellationToken.None);

        Assert.Equal(42, facts.Population);
        Assert.Null(facts.Summary);
    }
}
