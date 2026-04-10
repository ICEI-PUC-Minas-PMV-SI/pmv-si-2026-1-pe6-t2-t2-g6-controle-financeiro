using Infrastructure.Security;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace PoupaBem.API.Tests.Infrastructure.Security;

public class JwtTokenServiceTests
{
    [Fact]
    public void GenerateAccessToken_ShouldIncludeClaimsAndJwtMetadata()
    {
        var sut = CreateSut();
        var userId = Guid.NewGuid();

        var token = sut.GenerateAccessToken(
            userId,
            "user@local",
            "user.local",
            "User",
            "Local",
            new List<string> { "User", "Admin" });

        var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);

        Assert.Equal("issuer-test", jwt.Issuer);
        Assert.Contains("audience-test", jwt.Audiences);
        Assert.Contains(jwt.Claims, c => c.Type == JwtRegisteredClaimNames.Sub && c.Value == userId.ToString());
        Assert.Contains(jwt.Claims, c => c.Type == JwtRegisteredClaimNames.Email && c.Value == "user@local");
        Assert.Contains(jwt.Claims, c => c.Type == JwtRegisteredClaimNames.UniqueName && c.Value == "user.local");
        Assert.Contains(jwt.Claims, c => c.Type == "first_name" && c.Value == "User");
        Assert.Contains(jwt.Claims, c => c.Type == "last_name" && c.Value == "Local");
        Assert.Contains(jwt.Claims, c => c.Type == ClaimTypes.Role && c.Value == "User");
        Assert.Contains(jwt.Claims, c => c.Type == ClaimTypes.Role && c.Value == "Admin");
    }

    [Fact]
    public void GenerateAccessToken_ShouldCreateTokenValidWithConfiguredSigningKey()
    {
        var options = CreateOptions();
        var sut = new JwtTokenService(Options.Create(options));

        var token = sut.GenerateAccessToken(
            Guid.NewGuid(),
            "user@local",
            "user.local",
            "User",
            "Local",
            new List<string> { "User" });

        var handler = new JwtSecurityTokenHandler();

        var validationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(options.SecretKey)),
            ValidateIssuer = true,
            ValidIssuer = options.Issuer,
            ValidateAudience = true,
            ValidAudience = options.Audience,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };

        var principal = handler.ValidateToken(token, validationParameters, out var validatedToken);

        Assert.NotNull(principal);
        Assert.IsType<JwtSecurityToken>(validatedToken);
    }

    [Fact]
    public void GenerateRefreshToken_ShouldReturnDifferentNonEmptyValues()
    {
        var sut = CreateSut();

        var token1 = sut.GenerateRefreshToken();
        var token2 = sut.GenerateRefreshToken();

        Assert.False(string.IsNullOrWhiteSpace(token1));
        Assert.False(string.IsNullOrWhiteSpace(token2));
        Assert.NotEqual(token1, token2);
    }

    [Fact]
    public void GetAccessTokenExpiration_ShouldBeNearConfiguredWindow()
    {
        var options = CreateOptions();
        var sut = new JwtTokenService(Options.Create(options));
        var before = DateTime.UtcNow;

        var expiration = sut.GetAccessTokenExpiration();
        var after = DateTime.UtcNow;

        var minExpected = before.AddMinutes(options.AccessTokenExpirationMinutes);
        var maxExpected = after.AddMinutes(options.AccessTokenExpirationMinutes);

        Assert.True(expiration >= minExpected);
        Assert.True(expiration <= maxExpected);
    }

    private static JwtTokenService CreateSut()
    {
        return new JwtTokenService(Options.Create(CreateOptions()));
    }

    private static JwtOptions CreateOptions()
    {
        return new JwtOptions
        {
            Issuer = "issuer-test",
            Audience = "audience-test",
            SecretKey = "12345678901234567890123456789012",
            AccessTokenExpirationMinutes = 30,
            RefreshTokenExpirationDays = 7
        };
    }
}
