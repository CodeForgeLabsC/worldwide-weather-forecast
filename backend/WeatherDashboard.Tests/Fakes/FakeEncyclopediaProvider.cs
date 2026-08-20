using WeatherDashboard.Application.Abstractions;
using WeatherDashboard.Application.Locations;

namespace WeatherDashboard.Tests.Fakes;

public sealed class FakeEncyclopediaProvider : IEncyclopediaProvider
{
    public EncyclopediaSummary? Summary { get; set; }
    public string? LastTitle { get; private set; }

    public Task<EncyclopediaSummary?> GetSummaryAsync(string title, CancellationToken cancellationToken)
    {
        LastTitle = title;
        return Task.FromResult(Summary);
    }
}
