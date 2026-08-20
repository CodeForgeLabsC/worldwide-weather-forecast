# Build context is the backend/ directory (docker compose sets this), since the API project
# references its sibling Domain/Application/Infrastructure projects.
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY WeatherDashboard.Domain/*.csproj WeatherDashboard.Domain/
COPY WeatherDashboard.Application/*.csproj WeatherDashboard.Application/
COPY WeatherDashboard.Infrastructure/*.csproj WeatherDashboard.Infrastructure/
COPY WeatherDashboard.Api/*.csproj WeatherDashboard.Api/
RUN dotnet restore WeatherDashboard.Api/WeatherDashboard.Api.csproj

COPY WeatherDashboard.Domain/ WeatherDashboard.Domain/
COPY WeatherDashboard.Application/ WeatherDashboard.Application/
COPY WeatherDashboard.Infrastructure/ WeatherDashboard.Infrastructure/
COPY WeatherDashboard.Api/ WeatherDashboard.Api/

RUN dotnet publish WeatherDashboard.Api/WeatherDashboard.Api.csproj -c Release -o /app --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "WeatherDashboard.Api.dll"]
