using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using WeatherDashboard.Domain.Exceptions;

namespace WeatherDashboard.Api.Middleware;

/// <summary>
/// Central translation point from exceptions to <see cref="ProblemDetails"/> responses.
/// Provider-specific exception details never reach the client; only safe, pre-authored
/// messages do.
/// </summary>
public sealed class ApiExceptionHandler : IExceptionHandler
{
    private readonly ILogger<ApiExceptionHandler> _logger;

    public ApiExceptionHandler(ILogger<ApiExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        var (statusCode, title, detail) = exception switch
        {
            WeatherProviderException ex => (StatusCodes.Status502BadGateway, "Weather provider unavailable", ex.Message),
            ArgumentOutOfRangeException ex => (StatusCodes.Status400BadRequest, "Invalid request", ex.Message),
            _ => (StatusCodes.Status500InternalServerError, "An unexpected error occurred", "Please try again later."),
        };

        if (statusCode == StatusCodes.Status500InternalServerError)
        {
            _logger.LogError(exception, "Unhandled exception while processing {Method} {Path}", httpContext.Request.Method, httpContext.Request.Path);
        }
        else
        {
            _logger.LogWarning(exception, "Handled exception ({StatusCode}) while processing {Method} {Path}", statusCode, httpContext.Request.Method, httpContext.Request.Path);
        }

        httpContext.Response.StatusCode = statusCode;

        await httpContext.Response.WriteAsJsonAsync(new ProblemDetails
        {
            Status = statusCode,
            Title = title,
            Detail = detail,
            Instance = httpContext.Request.Path,
        }, cancellationToken);

        return true;
    }
}
