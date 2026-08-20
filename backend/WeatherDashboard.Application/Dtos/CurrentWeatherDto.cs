namespace WeatherDashboard.Application.Dtos;

public sealed record LocationDto(double Latitude, double Longitude, string Timezone);

public sealed record CurrentWeatherDto(
    LocationDto Location,
    double Temperature,
    double ApparentTemperature,
    int Humidity,
    double WindSpeed,
    int WindDirection,
    int WeatherCode,
    string Condition,
    bool IsDay,
    double? PrecipitationProbability);
