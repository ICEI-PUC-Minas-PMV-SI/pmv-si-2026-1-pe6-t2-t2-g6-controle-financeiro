using Domain.Entites;
using Domain.Enums;
using Infrastructure.Repositories;
using PoupaBem.API.Tests.Common;

namespace PoupaBem.API.Tests.Infrastructure.Repositories;

public class TransactionRepositoryTests
{
    [Fact]
    public async Task GetFilteredAsync_ShouldApplyAllFiltersAndOrderByDateDescending()
    {
        await using var context = DbContextTestFactory.Create();

        var userId = Guid.NewGuid();
        var otherUserId = Guid.NewGuid();

        var categoryA = new Category("Moradia", TransactionType.Expense, userId);
        var categoryB = new Category("Transporte", TransactionType.Expense, userId);
        var incomeCategory = new Category("Salário", TransactionType.Income, userId);
        var otherCategory = new Category("Outro", TransactionType.Expense, otherUserId);

        context.Categories.AddRange(categoryA, categoryB, incomeCategory, otherCategory);

        context.Transactions.AddRange(
            new Transaction("Conta 1", null, 100m, TransactionType.Expense, categoryA.Id, userId, new DateTime(2026, 1, 20, 0, 0, 0, DateTimeKind.Utc)),
            new Transaction("Conta 2", null, 80m, TransactionType.Expense, categoryA.Id, userId, new DateTime(2026, 1, 10, 0, 0, 0, DateTimeKind.Utc)),
            new Transaction("Fora categoria", null, 90m, TransactionType.Expense, categoryB.Id, userId, new DateTime(2026, 1, 15, 0, 0, 0, DateTimeKind.Utc)),
            new Transaction("Fora tipo", null, 2000m, TransactionType.Income, incomeCategory.Id, userId, new DateTime(2026, 1, 12, 0, 0, 0, DateTimeKind.Utc)),
            new Transaction("Fora período", null, 70m, TransactionType.Expense, categoryA.Id, userId, new DateTime(2026, 2, 2, 0, 0, 0, DateTimeKind.Utc)),
            new Transaction("Outro usuário", null, 60m, TransactionType.Expense, otherCategory.Id, otherUserId, new DateTime(2026, 1, 18, 0, 0, 0, DateTimeKind.Utc)));

        await context.SaveChangesAsync();

        var repository = new TransactionRepository(context);

        var result = await repository.GetFilteredAsync(
            userId,
            new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc),
            new DateTime(2026, 1, 31, 23, 59, 59, DateTimeKind.Utc),
            categoryA.Id,
            TransactionType.Expense,
            CancellationToken.None);

        Assert.Equal(2, result.Count);
        Assert.Equal("Conta 1", result[0].Title);
        Assert.Equal("Conta 2", result[1].Title);
        Assert.True(result[0].OcurredAt > result[1].OcurredAt);
    }

    [Fact]
    public async Task GetFilteredAsync_ShouldReturnAllUserTransactions_WhenFiltersAreNull()
    {
        await using var context = DbContextTestFactory.Create();

        var userId = Guid.NewGuid();
        var otherUserId = Guid.NewGuid();

        var userCategory = new Category("Moradia", TransactionType.Expense, userId);
        var otherCategory = new Category("Outro", TransactionType.Expense, otherUserId);

        context.Categories.AddRange(userCategory, otherCategory);

        context.Transactions.AddRange(
            new Transaction("Conta A", null, 100m, TransactionType.Expense, userCategory.Id, userId, new DateTime(2026, 4, 10, 0, 0, 0, DateTimeKind.Utc)),
            new Transaction("Conta B", null, 50m, TransactionType.Expense, userCategory.Id, userId, new DateTime(2026, 4, 2, 0, 0, 0, DateTimeKind.Utc)),
            new Transaction("Conta Outro", null, 999m, TransactionType.Expense, otherCategory.Id, otherUserId, new DateTime(2026, 4, 8, 0, 0, 0, DateTimeKind.Utc)));

        await context.SaveChangesAsync();

        var repository = new TransactionRepository(context);

        var result = await repository.GetFilteredAsync(userId, null, null, null, null, CancellationToken.None);

        Assert.Equal(2, result.Count);
        Assert.Equal("Conta A", result[0].Title);
        Assert.Equal("Conta B", result[1].Title);
    }

    [Fact]
    public async Task GetTrackedByIdForUserAsync_ShouldReturnNull_WhenTransactionBelongsToAnotherUser()
    {
        await using var context = DbContextTestFactory.Create();

        var ownerId = Guid.NewGuid();
        var otherUserId = Guid.NewGuid();

        var category = new Category("Moradia", TransactionType.Expense, ownerId);
        context.Categories.Add(category);

        var transaction = new Transaction(
            "Conta",
            null,
            120m,
            TransactionType.Expense,
            category.Id,
            ownerId,
            DateTime.UtcNow);

        context.Transactions.Add(transaction);
        await context.SaveChangesAsync();

        var repository = new TransactionRepository(context);

        var result = await repository.GetTrackedByIdForUserAsync(transaction.Id, otherUserId, CancellationToken.None);

        Assert.Null(result);
    }
}
