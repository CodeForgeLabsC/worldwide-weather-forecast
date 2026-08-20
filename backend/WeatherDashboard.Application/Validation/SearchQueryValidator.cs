namespace WeatherDashboard.Application.Validation;

/// <summary>Validation rules for free-text location search input.</summary>
public static class SearchQueryValidator
{
    public const int MinLength = 1;
    public const int MaxLength = 100;

    public static bool IsValid(string? query) =>
        !string.IsNullOrWhiteSpace(query) && query.Trim().Length is >= MinLength and <= MaxLength;
}
