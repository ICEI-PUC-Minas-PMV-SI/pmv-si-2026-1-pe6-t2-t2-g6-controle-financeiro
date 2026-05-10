using Application.DTOs;
using System.Net.Http.Headers;
using System.Net.Http.Json;

namespace PoupaBem.API.Tests.Integration;

public static class IntegrationAuthHelper
{
    public const string DefaultPassword = "Test@1234";

    public static RegisterUserRequest CreateRegisterRequest(string emailPrefix = "user")
    {
        var suffix = Guid.NewGuid().ToString("N");

        return new RegisterUserRequest
        {
            FirstName = "Integration",
            LastName = "Tests",
            Email = $"{emailPrefix}.{suffix}@tests.local",
            Password = DefaultPassword,
            ConfirmPassword = DefaultPassword
        };
    }

    public static async Task<AuthResponse> RegisterAsync(HttpClient client, RegisterUserRequest request)
    {
        var response = await client.PostAsJsonAsync("/api/auth/register", request);
        response.EnsureSuccessStatusCode();

        var payload = await response.Content.ReadFromJsonAsync<AuthResponse>();
        return payload ?? throw new InvalidOperationException("Auth payload was not returned by /api/auth/register.");
    }

    public static async Task<AuthResponse> RegisterRandomUserAsync(HttpClient client, string emailPrefix = "user")
    {
        var request = CreateRegisterRequest(emailPrefix);
        return await RegisterAsync(client, request);
    }

    public static void Authenticate(HttpClient client, string accessToken)
    {
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
    }
}
