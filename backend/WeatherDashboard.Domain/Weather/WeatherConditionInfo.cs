using WeatherDashboard.Domain.ValueObjects;

namespace WeatherDashboard.Domain.Weather;

/// <summary>Result of mapping a provider weather code to an application-level condition.</summary>
public sealed record WeatherConditionInfo(WeatherCondition Condition, string Label);
