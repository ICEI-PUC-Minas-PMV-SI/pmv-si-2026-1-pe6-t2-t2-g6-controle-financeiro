using Application.DTOs.Categories;
using Domain.Enums;
using System.Net;
using System.Net.Http.Json;

namespace PoupaBem.API.Tests.Integration;

[Collection(IntegrationTestCollection.Name)]
public class CategoriesIntegrationTests
{
    private readonly IntegrationTestWebAppFactory _factory;

    public CategoriesIntegrationTests(IntegrationTestWebAppFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task GetAll_ShouldReturnUnauthorized_WhenRequestHasNoToken()
    {
        await _factory.ResetStateAsync();
        using var client = _factory.CreateApiClient();

        var response = await client.GetAsync("/api/categories");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task CreateUpdateDelete_ShouldWork_ForAuthenticatedUser()
    {
        await _factory.ResetStateAsync();
        using var client = _factory.CreateApiClient();

        var auth = await IntegrationAuthHelper.RegisterRandomUserAsync(client, "categories-owner");
        IntegrationAuthHelper.Authenticate(client, auth.AccessToken);

        var createRequest = new CreateCategoryRequest
        {
            Name = $"Moradia-{Guid.NewGuid():N}",
            Type = TransactionType.Expense
        };

        var createResponse = await client.PostAsJsonAsync("/api/categories", createRequest);
        Assert.Equal(HttpStatusCode.OK, createResponse.StatusCode);

        var createdCategory = await createResponse.Content.ReadFromJsonAsync<CategoryResponse>();
        Assert.NotNull(createdCategory);

        var getAfterCreate = await client.GetAsync("/api/categories");
        Assert.Equal(HttpStatusCode.OK, getAfterCreate.StatusCode);

        var categoriesAfterCreate = await getAfterCreate.Content.ReadFromJsonAsync<List<CategoryResponse>>();
        Assert.NotNull(categoriesAfterCreate);
        Assert.Contains(categoriesAfterCreate, x => x.Id == createdCategory.Id);

        var updateRequest = new UpdateCategoryRequest
        {
            Name = $"Moradia-Atualizada-{Guid.NewGuid():N}",
            Type = TransactionType.Expense
        };

        var updateResponse = await client.PutAsJsonAsync($"/api/categories/{createdCategory.Id}", updateRequest);
        Assert.Equal(HttpStatusCode.OK, updateResponse.StatusCode);

        var updatedCategory = await updateResponse.Content.ReadFromJsonAsync<CategoryResponse>();
        Assert.NotNull(updatedCategory);
        Assert.Equal(updateRequest.Name, updatedCategory.Name);

        var deleteResponse = await client.DeleteAsync($"/api/categories/{createdCategory.Id}");
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);

        var getAfterDelete = await client.GetAsync("/api/categories");
        Assert.Equal(HttpStatusCode.OK, getAfterDelete.StatusCode);

        var categoriesAfterDelete = await getAfterDelete.Content.ReadFromJsonAsync<List<CategoryResponse>>();
        Assert.NotNull(categoriesAfterDelete);
        Assert.DoesNotContain(categoriesAfterDelete, x => x.Id == createdCategory.Id);
    }

    [Fact]
    public async Task Create_ShouldReturnBadRequest_WhenCategoryNameAlreadyExists()
    {
        await _factory.ResetStateAsync();
        using var client = _factory.CreateApiClient();

        var auth = await IntegrationAuthHelper.RegisterRandomUserAsync(client, "categories-duplicate");
        IntegrationAuthHelper.Authenticate(client, auth.AccessToken);

        var categoryName = $"Lazer-{Guid.NewGuid():N}";

        var firstResponse = await client.PostAsJsonAsync("/api/categories", new CreateCategoryRequest
        {
            Name = categoryName,
            Type = TransactionType.Expense
        });

        Assert.Equal(HttpStatusCode.OK, firstResponse.StatusCode);

        var secondResponse = await client.PostAsJsonAsync("/api/categories", new CreateCategoryRequest
        {
            Name = categoryName,
            Type = TransactionType.Expense
        });

        Assert.Equal(HttpStatusCode.BadRequest, secondResponse.StatusCode);

        var payload = await secondResponse.Content.ReadFromJsonAsync<ApiErrorResponse>();
        Assert.NotNull(payload);
        Assert.Equal("business_error", payload.Error);
        Assert.Contains("categoria", payload.Message, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task User_ShouldNotEditOrSee_CategoryFromAnotherUser()
    {
        await _factory.ResetStateAsync();

        using var ownerClient = _factory.CreateApiClient();
        var ownerAuth = await IntegrationAuthHelper.RegisterRandomUserAsync(ownerClient, "categories-owner-2");
        IntegrationAuthHelper.Authenticate(ownerClient, ownerAuth.AccessToken);

        var ownerCategory = await CreateCategoryAsync(ownerClient, $"Saude-{Guid.NewGuid():N}", TransactionType.Expense);

        using var otherClient = _factory.CreateApiClient();
        var otherAuth = await IntegrationAuthHelper.RegisterRandomUserAsync(otherClient, "categories-other");
        IntegrationAuthHelper.Authenticate(otherClient, otherAuth.AccessToken);

        var getResponse = await otherClient.GetAsync("/api/categories");
        Assert.Equal(HttpStatusCode.OK, getResponse.StatusCode);

        var categories = await getResponse.Content.ReadFromJsonAsync<List<CategoryResponse>>();
        Assert.NotNull(categories);
        Assert.DoesNotContain(categories, x => x.Id == ownerCategory.Id);

        var updateResponse = await otherClient.PutAsJsonAsync($"/api/categories/{ownerCategory.Id}", new UpdateCategoryRequest
        {
            Name = "Tentativa-Invalida",
            Type = TransactionType.Expense
        });

        Assert.Equal(HttpStatusCode.BadRequest, updateResponse.StatusCode);

        var payload = await updateResponse.Content.ReadFromJsonAsync<ApiErrorResponse>();
        Assert.NotNull(payload);
        Assert.Equal("business_error", payload.Error);
        Assert.Contains("categoria", payload.Message, StringComparison.OrdinalIgnoreCase);
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
}
