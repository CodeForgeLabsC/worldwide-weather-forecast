using Microsoft.Extensions.DependencyInjection;
using WeatherDashboard.Application.Abstractions;
using WeatherDashboard.Application.Locations;
using WeatherDashboard.Application.Weather;

namespace WeatherDashboard.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IWeatherService, WeatherService>();
        services.AddScoped<ILocationService, LocationService>();

        return services;
    }
}
