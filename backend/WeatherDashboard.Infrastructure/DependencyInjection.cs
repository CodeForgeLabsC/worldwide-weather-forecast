using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using WeatherDashboard.Application.Abstractions;
using WeatherDashboard.Infrastructure.Caching;
using WeatherDashboard.Infrastructure.OpenMeteo;
using WeatherDashboard.Infrastructure.Wikipedia;

namespace WeatherDashboard.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services
            .AddOptions<OpenMeteoOptions>()
            .Bind(configuration.GetSection(OpenMeteoOptions.SectionName))
            .ValidateDataAnnotations()
            .ValidateOnStart();

        services
            .AddOptions<EncyclopediaOptions>()
            .Bind(configuration.GetSection(EncyclopediaOptions.SectionName))
            .ValidateDataAnnotations()
            .ValidateOnStart();

        services.AddMemoryCache();

        services.AddHttpClient<OpenMeteoWeatherProvider>((serviceProvider, client) =>
        {
            var options = serviceProvider.GetRequiredService<IOptions<OpenMeteoOptions>>().Value;
            client.BaseAddress = new Uri(options.ForecastBaseUrl);
            client.Timeout = TimeSpan.FromSeconds(options.TimeoutSeconds);
        });

        services.AddHttpClient<OpenMeteoGeocodingProvider>((serviceProvider, client) =>
        {
            var options = serviceProvider.GetRequiredService<IOptions<OpenMeteoOptions>>().Value;
            client.BaseAddress = new Uri(options.GeocodingBaseUrl);
            client.Timeout = TimeSpan.FromSeconds(options.TimeoutSeconds);
        });

        services.AddHttpClient<WikipediaEncyclopediaProvider>((serviceProvider, client) =>
        {
            var options = serviceProvider.GetRequiredService<IOptions<EncyclopediaOptions>>().Value;
            client.BaseAddress = new Uri(options.BaseUrl);
            client.Timeout = TimeSpan.FromSeconds(options.TimeoutSeconds);
            client.DefaultRequestHeaders.UserAgent.ParseAdd("GForecastWeatherDashboard/1.0");
        });

        services.AddScoped<IGeocodingProvider>(sp => sp.GetRequiredService<OpenMeteoGeocodingProvider>());
        services.AddScoped<IEncyclopediaProvider>(sp => sp.GetRequiredService<WikipediaEncyclopediaProvider>());

        services.AddScoped<IWeatherProvider>(sp => new CachingWeatherProvider(
            sp.GetRequiredService<OpenMeteoWeatherProvider>(),
            sp.GetRequiredService<IMemoryCache>(),
            sp.GetRequiredService<IOptions<OpenMeteoOptions>>(),
            sp.GetRequiredService<ILogger<CachingWeatherProvider>>()));

        return services;
    }
}
