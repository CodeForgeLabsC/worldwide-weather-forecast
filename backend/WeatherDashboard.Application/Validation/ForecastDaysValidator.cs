namespace WeatherDashboard.Application.Validation;

/// <summary>Validation rules for the forecast look-ahead window.</summary>
public static class ForecastDaysValidator
{
    public const int MinDays = 1;
    public const int MaxDays = 16;

    public static bool IsValid(int days) => days is >= MinDays and <= MaxDays;
}
