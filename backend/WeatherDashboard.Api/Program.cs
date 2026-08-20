using Microsoft.AspNetCore.HttpOverrides;
using WeatherDashboard.Api.Configuration;
using WeatherDashboard.Api.Middleware;
using WeatherDashboard.Application;
using WeatherDashboard.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Some hosts (Render, Railway, Cloud Run) assign a container port dynamically via PORT rather
// than a fixed one — when set, it takes priority over ASPNETCORE_URLS/the Dockerfile's default.
var cloudAssignedPort = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrWhiteSpace(cloudAssignedPort))
{
    builder.WebHost.UseUrls($"http://0.0.0.0:{cloudAssignedPort}");
}

builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

builder.Services
    .AddOptions<CorsOptions>()
    .Bind(builder.Configuration.GetSection(CorsOptions.SectionName));

builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<ApiExceptionHandler>();

const string DashboardCorsPolicy = "DashboardCors";
builder.Services.AddCors(options =>
{
    options.AddPolicy(DashboardCorsPolicy, policy =>
    {
        var allowedOrigins = builder.Configuration
            .GetSection(CorsOptions.SectionName)
            .Get<CorsOptions>()?.AllowedOrigins ?? [];

        if (allowedOrigins.Length > 0)
        {
            policy.WithOrigins(allowedOrigins)
                .AllowAnyHeader()
                .AllowAnyMethod();
        }
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Cloud load balancers (Render, Railway, Fly.io, Azure App Service, Cloud Run, etc.) terminate
// TLS at the edge and forward plain HTTP internally. Without trusting X-Forwarded-Proto here,
// UseHttpsRedirection below can't tell the request was already HTTPS and would issue a bogus
// redirect. KnownNetworks/KnownProxies are cleared because the proxy IP isn't known/stable on
// managed platforms — this middleware only reads a header, it doesn't skip any auth/CORS checks.
var forwardedHeadersOptions = new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto,
};
forwardedHeadersOptions.KnownIPNetworks.Clear();
forwardedHeadersOptions.KnownProxies.Clear();
app.UseForwardedHeaders(forwardedHeadersOptions);

app.UseExceptionHandler();

app.UseHttpsRedirection();

app.UseCors(DashboardCorsPolicy);

app.UseAuthorization();

app.MapControllers();

app.Run();

/// <summary>Entry point class, exposed for WebApplicationFactory-based integration tests.</summary>
public partial class Program
{
}
