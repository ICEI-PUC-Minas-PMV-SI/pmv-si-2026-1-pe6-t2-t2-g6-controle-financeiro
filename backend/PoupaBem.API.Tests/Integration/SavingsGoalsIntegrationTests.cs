using Application.DTOs.Goals;
using System.Net;
using System.Net.Http.Json;

namespace PoupaBem.API.Tests.Integration;

[Collection(IntegrationTestCollection.Name)]
public class SavingsGoalsIntegrationTests
{
    private readonly IntegrationTestWebAppFactory _factory;

    public SavingsGoalsIntegrationTests(IntegrationTestWebAppFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task GetAll_ShouldReturnUnauthorized_WhenRequestHasNoToken()
    {
        await _factory.ResetStateAsync();
        using var client = _factory.CreateApiClient();

        var response = await client.GetAsync("/api/savings-goals");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task CreateDepositUpdateDelete_ShouldWork_ForAuthenticatedUser()
    {
        await _factory.ResetStateAsync();
        using var client = _factory.CreateApiClient();

        var auth = await IntegrationAuthHelper.RegisterRandomUserAsync(client, "goals-owner");
        IntegrationAuthHelper.Authenticate(client, auth.AccessToken);

        var createResponse = await client.PostAsJsonAsync("/api/savings-goals", new CreateSavingsGoalRequest
        {
            Name = $"Viagem-{Guid.NewGuid():N}",
            TargetAmount = 5000m
        });

        Assert.Equal(HttpStatusCode.OK, createResponse.StatusCode);

        var created = await createResponse.Content.ReadFromJsonAsync<SavingsGoalResponse>();
        Assert.NotNull(created);
        Assert.Equal(0m, created.CurrentAmount);

        var depositResponse = await client.PostAsJsonAsync($"/api/savings-goals/{created.Id}/deposit", new DepositSavingsGoalRequest
        {
            Amount = 1250m
        });

        Assert.Equal(HttpStatusCode.OK, depositResponse.StatusCode);

        var afterDeposit = await depositResponse.Content.ReadFromJsonAsync<SavingsGoalResponse>();
        Assert.NotNull(afterDeposit);
        Assert.Equal(1250m, afterDeposit.CurrentAmount);
        Assert.Equal(25m, afterDeposit.ProgressPercent);

        var updateResponse = await client.PutAsJsonAsync($"/api/savings-goals/{created.Id}", new UpdateSavingsGoalRequest
        {
            Name = $"Viagem-Atualizada-{Guid.NewGuid():N}",
            TargetAmount = 4000m
        });

        Assert.Equal(HttpStatusCode.OK, updateResponse.StatusCode);

        var updated = await updateResponse.Content.ReadFromJsonAsync<SavingsGoalResponse>();
        Assert.NotNull(updated);
        Assert.Equal(4000m, updated.TargetAmount);

        var deleteResponse = await client.DeleteAsync($"/api/savings-goals/{created.Id}");

        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);

        var getDeletedResponse = await client.GetAsync($"/api/savings-goals/{created.Id}");
        Assert.Equal(HttpStatusCode.BadRequest, getDeletedResponse.StatusCode);

        var error = await getDeletedResponse.Content.ReadFromJsonAsync<ApiErrorResponse>();
        Assert.NotNull(error);
        Assert.Equal("business_error", error.Error);
    }

    [Fact]
    public async Task User_ShouldNotAccess_GoalFromAnotherUser()
    {
        await _factory.ResetStateAsync();

        using var ownerClient = _factory.CreateApiClient();
        var ownerAuth = await IntegrationAuthHelper.RegisterRandomUserAsync(ownerClient, "goals-owner-2");
        IntegrationAuthHelper.Authenticate(ownerClient, ownerAuth.AccessToken);

        var ownerGoal = await CreateGoalAsync(ownerClient, $"Reserva-{Guid.NewGuid():N}", 3000m);

        using var otherClient = _factory.CreateApiClient();
        var otherAuth = await IntegrationAuthHelper.RegisterRandomUserAsync(otherClient, "goals-other");
        IntegrationAuthHelper.Authenticate(otherClient, otherAuth.AccessToken);

        var getByIdResponse = await otherClient.GetAsync($"/api/savings-goals/{ownerGoal.Id}");
        Assert.Equal(HttpStatusCode.BadRequest, getByIdResponse.StatusCode);

        var depositResponse = await otherClient.PostAsJsonAsync($"/api/savings-goals/{ownerGoal.Id}/deposit", new DepositSavingsGoalRequest
        {
            Amount = 100m
        });

        Assert.Equal(HttpStatusCode.BadRequest, depositResponse.StatusCode);

        var listResponse = await otherClient.GetAsync("/api/savings-goals");
        Assert.Equal(HttpStatusCode.OK, listResponse.StatusCode);

        var list = await listResponse.Content.ReadFromJsonAsync<List<SavingsGoalResponse>>();
        Assert.NotNull(list);
        Assert.DoesNotContain(list, x => x.Id == ownerGoal.Id);
    }

    [Fact]
    public async Task Create_ShouldReturnBadRequest_WhenPayloadIsInvalid()
    {
        await _factory.ResetStateAsync();
        using var client = _factory.CreateApiClient();

        var auth = await IntegrationAuthHelper.RegisterRandomUserAsync(client, "goals-invalid");
        IntegrationAuthHelper.Authenticate(client, auth.AccessToken);

        var response = await client.PostAsJsonAsync("/api/savings-goals", new CreateSavingsGoalRequest
        {
            Name = "A",
            TargetAmount = 0m
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    private static async Task<SavingsGoalResponse> CreateGoalAsync(HttpClient client, string name, decimal targetAmount)
    {
        var response = await client.PostAsJsonAsync("/api/savings-goals", new CreateSavingsGoalRequest
        {
            Name = name,
            TargetAmount = targetAmount
        });

        response.EnsureSuccessStatusCode();

        var payload = await response.Content.ReadFromJsonAsync<SavingsGoalResponse>();
        return payload ?? throw new InvalidOperationException("Savings goal payload was not returned by /api/savings-goals.");
    }
}
