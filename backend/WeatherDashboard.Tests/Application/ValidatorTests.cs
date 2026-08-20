using WeatherDashboard.Application.Validation;

namespace WeatherDashboard.Tests.Application;

public class SearchQueryValidatorTests
{
    [Theory]
    [InlineData("Warsaw")]
    [InlineData("São Paulo")]
    [InlineData("a")]
    public void IsValid_AcceptableQueries_ReturnsTrue(string query) =>
        Assert.True(SearchQueryValidator.IsValid(query));

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData(null)]
    public void IsValid_EmptyOrWhitespace_ReturnsFalse(string? query) =>
        Assert.False(SearchQueryValidator.IsValid(query));

    [Fact]
    public void IsValid_QueryExceedingMaxLength_ReturnsFalse()
    {
        var tooLong = new string('a', SearchQueryValidator.MaxLength + 1);

        Assert.False(SearchQueryValidator.IsValid(tooLong));
    }
}

public class ForecastDaysValidatorTests
{
    [Theory]
    [InlineData(1)]
    [InlineData(7)]
    [InlineData(16)]
    public void IsValid_WithinRange_ReturnsTrue(int days) =>
        Assert.True(ForecastDaysValidator.IsValid(days));

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    [InlineData(17)]
    public void IsValid_OutOfRange_ReturnsFalse(int days) =>
        Assert.False(ForecastDaysValidator.IsValid(days));
}
