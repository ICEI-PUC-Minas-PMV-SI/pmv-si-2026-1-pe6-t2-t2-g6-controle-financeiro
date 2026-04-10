using Application.DTOs;
using System.Net;
using System.Net.Http.Json;
using System.Text.Json;

namespace PoupaBem.API.Tests.Integration;

[Collection(IntegrationTestCollection.Name)]
public class AuthIntegrationTests
{
    private readonly IntegrationTestWebAppFactory _factory;

    public AuthIntegrationTests(IntegrationTestWebAppFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Register_ShouldReturnOk_WithTokens()
    {
        await _factory.ResetStateAsync();
        using var client = _factory.CreateApiClient();

        var registerRequest = IntegrationAuthHelper.CreateRegisterRequest("auth-register");

        var response = await client.PostAsJsonAsync("/api/auth/register", registerRequest);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var payload = await response.Content.ReadFromJsonAsync<AuthResponse>();
        Assert.NotNull(payload);
        Assert.False(string.IsNullOrWhiteSpace(payload.AccessToken));
        Assert.False(string.IsNullOrWhiteSpace(payload.RefreshToken));
        Assert.Equal(registerRequest.Email, payload.Email);
    }

    [Fact]
    public async Task Login_ShouldReturnOk_WithToken()
    {
        await _factory.ResetStateAsync();
        using var client = _factory.CreateApiClient();

        var registerRequest = IntegrationAuthHelper.CreateRegisterRequest("auth-login");
        var registerPayload = await IntegrationAuthHelper.RegisterAsync(client, registerRequest);

        var loginRequest = new LoginRequest
        {
            Email = registerRequest.Email,
            Password = IntegrationAuthHelper.DefaultPassword
        };

        var response = await client.PostAsJsonAsync("/api/auth/login", loginRequest);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var payload = await response.Content.ReadFromJsonAsync<AuthResponse>();
        Assert.NotNull(payload);
        Assert.False(string.IsNullOrWhiteSpace(payload.AccessToken));
        Assert.False(string.IsNullOrWhiteSpace(payload.RefreshToken));
        Assert.Equal(registerPayload.UserId, payload.UserId);
    }

    [Fact]
    public async Task Me_ShouldReturnOk_WhenTokenIsValid()
    {
        await _factory.ResetStateAsync();
        using var client = _factory.CreateApiClient();

        var registerRequest = IntegrationAuthHelper.CreateRegisterRequest("auth-me");
        var authPayload = await IntegrationAuthHelper.RegisterAsync(client, registerRequest);
        IntegrationAuthHelper.Authenticate(client, authPayload.AccessToken);

        var response = await client.GetAsync("/api/auth/me");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        using var meJson = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        var root = meJson.RootElement;

        Assert.Equal(authPayload.UserId, root.GetProperty("userId").GetString());
        Assert.Equal(registerRequest.Email, root.GetProperty("email").GetString());
    }

    [Fact]
    public async Task Refresh_ShouldReturnOk_WithNewTokens()
    {
        await _factory.ResetStateAsync();
        using var client = _factory.CreateApiClient();

        var authPayload = await IntegrationAuthHelper.RegisterRandomUserAsync(client, "auth-refresh");

        var refreshRequest = new RefreshTokenRequest
        {
            RefreshToken = authPayload.RefreshToken
        };

        var response = await client.PostAsJsonAsync("/api/auth/refresh", refreshRequest);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var payload = await response.Content.ReadFromJsonAsync<AuthResponse>();
        Assert.NotNull(payload);
        Assert.False(string.IsNullOrWhiteSpace(payload.AccessToken));
        Assert.False(string.IsNullOrWhiteSpace(payload.RefreshToken));
        Assert.NotEqual(authPayload.RefreshToken, payload.RefreshToken);
    }

    [Fact]
    public async Task Register_ShouldReturnBadRequest_WhenEmailAlreadyExists()
    {
        await _factory.ResetStateAsync();
        using var client = _factory.CreateApiClient();

        var registerRequest = IntegrationAuthHelper.CreateRegisterRequest("auth-duplicate");
        var firstResponse = await client.PostAsJsonAsync("/api/auth/register", registerRequest);

        Assert.Equal(HttpStatusCode.OK, firstResponse.StatusCode);

        var secondResponse = await client.PostAsJsonAsync("/api/auth/register", registerRequest);

        Assert.Equal(HttpStatusCode.BadRequest, secondResponse.StatusCode);

        var payload = await secondResponse.Content.ReadFromJsonAsync<ApiErrorResponse>();
        Assert.NotNull(payload);
        Assert.Equal("business_error", payload.Error);
        Assert.Contains("Email", payload.Message, StringComparison.OrdinalIgnoreCase);
    }
}
