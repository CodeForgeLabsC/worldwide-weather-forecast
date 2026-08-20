namespace WeatherDashboard.Domain.Exceptions;

/// <summary>
/// Raised when an upstream weather/geocoding provider fails or returns an unusable response.
/// Caught at the API boundary and translated into a ProblemDetails response — never surfaced
/// to clients with provider-specific details.
/// </summary>
public sealed class WeatherProviderException : Exception
{
    public WeatherProviderException(string message) : base(message)
    {
    }

    public WeatherProviderException(string message, Exception innerException) : base(message, innerException)
    {
    }
}
