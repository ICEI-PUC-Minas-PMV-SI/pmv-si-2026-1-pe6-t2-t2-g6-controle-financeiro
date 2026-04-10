using Application.DTOs.Categories;
using Application.DTOs.Transactions;
using Domain.Enums;
using System.Net;
using System.Net.Http.Json;

namespace PoupaBem.API.Tests.Integration;

[Collection(IntegrationTestCollection.Name)]
public class TransactionsIntegrationTests
{
    private readonly IntegrationTestWebAppFactory _factory;

    public TransactionsIntegrationTests(IntegrationTestWebAppFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Create_ShouldPersistAndReturnTransaction_ForAuthenticatedUser()
    {
        await _factory.ResetStateAsync();
        using var client = _factory.CreateApiClient();

        var auth = await IntegrationAuthHelper.RegisterRandomUserAsync(client, "transactions-create");
        IntegrationAuthHelper.Authenticate(client, auth.AccessToken);

        var category = await CreateCategoryAsync(client, $"Mercado-{Guid.NewGuid():N}", TransactionType.Expense);

        var createRequest = new CreateTransactionRequest
        {
            Title = "Supermercado",
            Description = "Compra do mes",
            Amount = 245.90m,
            TransactionType = TransactionType.Expense,
            CategoryId = category.Id,
            OcurredAt = new DateTime(2026, 4, 5, 0, 0, 0, DateTimeKind.Utc)
        };

        var createResponse = await client.PostAsJsonAsync("/api/transactions", createRequest);

        Assert.Equal(HttpStatusCode.OK, createResponse.StatusCode);

        var createdTransaction = await createResponse.Content.ReadFromJsonAsync<TransactionResponse>();
        Assert.NotNull(createdTransaction);
        Assert.Equal(createRequest.Title, createdTransaction.Title);
        Assert.Equal(createRequest.Amount, createdTransaction.Amount);
        Assert.Equal(category.Id, createdTransaction.CategoryId);

        var listResponse = await client.GetAsync("/api/transactions");
        Assert.Equal(HttpStatusCode.OK, listResponse.StatusCode);

        var listPayload = await listResponse.Content.ReadFromJsonAsync<List<TransactionResponse>>();
        Assert.NotNull(listPayload);
        Assert.Contains(listPayload, x => x.Id == createdTransaction.Id);
    }

    [Fact]
    public async Task Create_ShouldReturnBadRequest_WhenCategoryTypeIsDifferentFromTransactionType()
    {
        await _factory.ResetStateAsync();
        using var client = _factory.CreateApiClient();

        var auth = await IntegrationAuthHelper.RegisterRandomUserAsync(client, "transactions-mismatch");
        IntegrationAuthHelper.Authenticate(client, auth.AccessToken);

        var incomeCategory = await CreateCategoryAsync(client, $"Salario-{Guid.NewGuid():N}", TransactionType.Income);

        var createResponse = await client.PostAsJsonAsync("/api/transactions", new CreateTransactionRequest
        {
            Title = "Conta de Luz",
            Description = "Abril",
            Amount = 220m,
            TransactionType = TransactionType.Expense,
            CategoryId = incomeCategory.Id,
            OcurredAt = DateTime.UtcNow
        });

        Assert.Equal(HttpStatusCode.BadRequest, createResponse.StatusCode);

        var payload = await createResponse.Content.ReadFromJsonAsync<ApiErrorResponse>();
        Assert.NotNull(payload);
        Assert.Equal("business_error", payload.Error);
        Assert.Contains("tipo", payload.Message, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task GetAll_ShouldApplyFiltersAndOrderByOccurredDateDescending()
    {
        await _factory.ResetStateAsync();
        using var client = _factory.CreateApiClient();

        var auth = await IntegrationAuthHelper.RegisterRandomUserAsync(client, "transactions-filter");
        IntegrationAuthHelper.Authenticate(client, auth.AccessToken);

        var expenseCategoryA = await CreateCategoryAsync(client, $"Moradia-{Guid.NewGuid():N}", TransactionType.Expense);
        var expenseCategoryB = await CreateCategoryAsync(client, $"Transporte-{Guid.NewGuid():N}", TransactionType.Expense);
        var incomeCategory = await CreateCategoryAsync(client, $"Salario-{Guid.NewGuid():N}", TransactionType.Income);

        await CreateTransactionAsync(client, new CreateTransactionRequest
        {
            Title = "Conta 1",
            Description = null,
            Amount = 100m,
            TransactionType = TransactionType.Expense,
            CategoryId = expenseCategoryA.Id,
            OcurredAt = new DateTime(2026, 1, 20, 0, 0, 0, DateTimeKind.Utc)
        });

        await CreateTransactionAsync(client, new CreateTransactionRequest
        {
            Title = "Conta 2",
            Description = null,
            Amount = 80m,
            TransactionType = TransactionType.Expense,
            CategoryId = expenseCategoryA.Id,
            OcurredAt = new DateTime(2026, 1, 10, 0, 0, 0, DateTimeKind.Utc)
        });

        await CreateTransactionAsync(client, new CreateTransactionRequest
        {
            Title = "Fora categoria",
            Description = null,
            Amount = 90m,
            TransactionType = TransactionType.Expense,
            CategoryId = expenseCategoryB.Id,
            OcurredAt = new DateTime(2026, 1, 15, 0, 0, 0, DateTimeKind.Utc)
        });

        await CreateTransactionAsync(client, new CreateTransactionRequest
        {
            Title = "Fora tipo",
            Description = null,
            Amount = 2000m,
            TransactionType = TransactionType.Income,
            CategoryId = incomeCategory.Id,
            OcurredAt = new DateTime(2026, 1, 12, 0, 0, 0, DateTimeKind.Utc)
        });

        var fromUtc = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        var toUtc = new DateTime(2026, 1, 31, 23, 59, 59, DateTimeKind.Utc);

        var query =
            $"/api/transactions?fromUtc={Uri.EscapeDataString(fromUtc.ToString("O"))}" +
            $"&toUtc={Uri.EscapeDataString(toUtc.ToString("O"))}" +
            $"&categoryId={expenseCategoryA.Id}" +
            $"&transactionType={(int)TransactionType.Expense}";

        var response = await client.GetAsync(query);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var payload = await response.Content.ReadFromJsonAsync<List<TransactionResponse>>();
        Assert.NotNull(payload);
        Assert.Equal(2, payload.Count);
        Assert.Equal("Conta 1", payload[0].Title);
        Assert.Equal("Conta 2", payload[1].Title);
    }

    [Fact]
    public async Task User_ShouldNotListOrDelete_TransactionFromAnotherUser()
    {
        await _factory.ResetStateAsync();

        using var ownerClient = _factory.CreateApiClient();
        var ownerAuth = await IntegrationAuthHelper.RegisterRandomUserAsync(ownerClient, "transactions-owner");
        IntegrationAuthHelper.Authenticate(ownerClient, ownerAuth.AccessToken);

        var ownerCategory = await CreateCategoryAsync(ownerClient, $"Moradia-{Guid.NewGuid():N}", TransactionType.Expense);
        var ownerTransaction = await CreateTransactionAsync(ownerClient, new CreateTransactionRequest
        {
            Title = "Conta owner",
            Description = null,
            Amount = 120m,
            TransactionType = TransactionType.Expense,
            CategoryId = ownerCategory.Id,
            OcurredAt = DateTime.UtcNow
        });

        using var otherClient = _factory.CreateApiClient();
        var otherAuth = await IntegrationAuthHelper.RegisterRandomUserAsync(otherClient, "transactions-other");
        IntegrationAuthHelper.Authenticate(otherClient, otherAuth.AccessToken);

        var listResponse = await otherClient.GetAsync("/api/transactions");
        Assert.Equal(HttpStatusCode.OK, listResponse.StatusCode);

        var listPayload = await listResponse.Content.ReadFromJsonAsync<List<TransactionResponse>>();
        Assert.NotNull(listPayload);
        Assert.DoesNotContain(listPayload, x => x.Id == ownerTransaction.Id);

        var deleteResponse = await otherClient.DeleteAsync($"/api/transactions/{ownerTransaction.Id}");

        Assert.Equal(HttpStatusCode.BadRequest, deleteResponse.StatusCode);

        var error = await deleteResponse.Content.ReadFromJsonAsync<ApiErrorResponse>();
        Assert.NotNull(error);
        Assert.Equal("business_error", error.Error);
        Assert.Contains("não encontrada", error.Message, StringComparison.OrdinalIgnoreCase);
    }

    private static async Task<CategoryResponse> CreateCategoryAsync(HttpClient client, string name, TransactionType type)
    {
        var response = await client.PostAsJsonAsync("/api/categories", new CreateCategoryRequest
        {
            Name = name,
            Type = type
        });

        response.EnsureSuccessStatusCode();

        var payload = await response.Content.ReadFromJsonAsync<CategoryResponse>();
        return payload ?? throw new InvalidOperationException("Category payload was not returned by /api/categories.");
    }

    private static async Task<TransactionResponse> CreateTransactionAsync(HttpClient client, CreateTransactionRequest request)
    {
        var response = await client.PostAsJsonAsync("/api/transactions", request);
        response.EnsureSuccessStatusCode();

        var payload = await response.Content.ReadFromJsonAsync<TransactionResponse>();
        return payload ?? throw new InvalidOperationException("Transaction payload was not returned by /api/transactions.");
    }
}
