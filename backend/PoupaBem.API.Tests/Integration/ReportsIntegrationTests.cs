using Application.DTOs.Categories;
using Application.DTOs.Reports;
using Application.DTOs.Transactions;
using Domain.Enums;
using System.Net;
using System.Net.Http.Json;
using System.Text;

namespace PoupaBem.API.Tests.Integration;

[Collection(IntegrationTestCollection.Name)]
public class ReportsIntegrationTests
{
    private readonly IntegrationTestWebAppFactory _factory;

    public ReportsIntegrationTests(IntegrationTestWebAppFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Summary_ShouldReturnAggregates_ForAuthenticatedUserOnly()
    {
        await _factory.ResetStateAsync();

        using var ownerClient = _factory.CreateApiClient();
        var ownerAuth = await IntegrationAuthHelper.RegisterRandomUserAsync(ownerClient, "reports-summary-owner");
        IntegrationAuthHelper.Authenticate(ownerClient, ownerAuth.AccessToken);

        var incomeCategory = await CreateCategoryAsync(ownerClient, $"Salario-{Guid.NewGuid():N}", TransactionType.Income);
        var expenseCategory = await CreateCategoryAsync(ownerClient, $"Moradia-{Guid.NewGuid():N}", TransactionType.Expense);

        await CreateTransactionAsync(ownerClient, new CreateTransactionRequest
        {
            Title = "Salario",
            Description = null,
            Amount = 4000m,
            TransactionType = TransactionType.Income,
            CategoryId = incomeCategory.Id,
            OcurredAt = new DateTime(2026, 4, 1, 0, 0, 0, DateTimeKind.Utc)
        });

        await CreateTransactionAsync(ownerClient, new CreateTransactionRequest
        {
            Title = "Aluguel",
            Description = null,
            Amount = 1200m,
            TransactionType = TransactionType.Expense,
            CategoryId = expenseCategory.Id,
            OcurredAt = new DateTime(2026, 4, 2, 0, 0, 0, DateTimeKind.Utc)
        });

        using var otherClient = _factory.CreateApiClient();
        var otherAuth = await IntegrationAuthHelper.RegisterRandomUserAsync(otherClient, "reports-summary-other");
        IntegrationAuthHelper.Authenticate(otherClient, otherAuth.AccessToken);

        var otherExpenseCategory = await CreateCategoryAsync(otherClient, $"Lazer-{Guid.NewGuid():N}", TransactionType.Expense);

        await CreateTransactionAsync(otherClient, new CreateTransactionRequest
        {
            Title = "Cinema",
            Description = null,
            Amount = 999m,
            TransactionType = TransactionType.Expense,
            CategoryId = otherExpenseCategory.Id,
            OcurredAt = new DateTime(2026, 4, 3, 0, 0, 0, DateTimeKind.Utc)
        });

        var response = await ownerClient.GetAsync("/api/reports/summary");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var summary = await response.Content.ReadFromJsonAsync<FinancialSummaryResponse>();
        Assert.NotNull(summary);
        Assert.Equal(4000m, summary.TotalIncome);
        Assert.Equal(1200m, summary.TotalExpense);
        Assert.Equal(2800m, summary.Balance);
    }

    [Fact]
    public async Task ExpensesByCategory_ShouldReturnGroupedTotals_OrderedByAmount()
    {
        await _factory.ResetStateAsync();
        using var client = _factory.CreateApiClient();

        var auth = await IntegrationAuthHelper.RegisterRandomUserAsync(client, "reports-expenses");
        IntegrationAuthHelper.Authenticate(client, auth.AccessToken);

        var housingCategory = await CreateCategoryAsync(client, $"Moradia-{Guid.NewGuid():N}", TransactionType.Expense);
        var transportCategory = await CreateCategoryAsync(client, $"Transporte-{Guid.NewGuid():N}", TransactionType.Expense);

        await CreateTransactionAsync(client, new CreateTransactionRequest
        {
            Title = "Aluguel",
            Description = null,
            Amount = 1800m,
            TransactionType = TransactionType.Expense,
            CategoryId = housingCategory.Id,
            OcurredAt = DateTime.UtcNow
        });

        await CreateTransactionAsync(client, new CreateTransactionRequest
        {
            Title = "Condominio",
            Description = null,
            Amount = 300m,
            TransactionType = TransactionType.Expense,
            CategoryId = housingCategory.Id,
            OcurredAt = DateTime.UtcNow
        });

        await CreateTransactionAsync(client, new CreateTransactionRequest
        {
            Title = "Combustivel",
            Description = null,
            Amount = 500m,
            TransactionType = TransactionType.Expense,
            CategoryId = transportCategory.Id,
            OcurredAt = DateTime.UtcNow
        });

        var response = await client.GetAsync("/api/reports/expenses-by-category");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var items = await response.Content.ReadFromJsonAsync<List<CategoryExpenseReportItem>>();
        Assert.NotNull(items);
        Assert.Equal(2, items.Count);
        Assert.Equal(housingCategory.Id, items[0].CategoryId);
        Assert.Equal(2100m, items[0].TotalAmount);
        Assert.Equal(transportCategory.Id, items[1].CategoryId);
        Assert.Equal(500m, items[1].TotalAmount);
    }

    [Fact]
    public async Task ExportTransactionsCsv_ShouldReturnCsvContent_WithHeaderAndRows()
    {
        await _factory.ResetStateAsync();
        using var client = _factory.CreateApiClient();

        var auth = await IntegrationAuthHelper.RegisterRandomUserAsync(client, "reports-csv");
        IntegrationAuthHelper.Authenticate(client, auth.AccessToken);

        var category = await CreateCategoryAsync(client, $"Mercado-{Guid.NewGuid():N}", TransactionType.Expense);

        await CreateTransactionAsync(client, new CreateTransactionRequest
        {
            Title = "Mercado, \"Extra\"",
            Description = "Compra",
            Amount = 149.90m,
            TransactionType = TransactionType.Expense,
            CategoryId = category.Id,
            OcurredAt = new DateTime(2026, 4, 4, 12, 0, 0, DateTimeKind.Utc)
        });

        var response = await client.GetAsync("/api/reports/transactions-export");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("text/csv; charset=utf-8", response.Content.Headers.ContentType?.ToString());

        var bytes = await response.Content.ReadAsByteArrayAsync();
        var csv = Encoding.UTF8.GetString(bytes).TrimStart('\uFEFF');

        Assert.Contains("occurred_at_utc,title,transaction_type,amount,category_id", csv, StringComparison.Ordinal);
        Assert.Contains("\"Mercado, \"\"Extra\"\"\"", csv, StringComparison.Ordinal);
        Assert.Contains("Expense", csv, StringComparison.Ordinal);
        Assert.Contains(category.Id.ToString(), csv, StringComparison.Ordinal);
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
