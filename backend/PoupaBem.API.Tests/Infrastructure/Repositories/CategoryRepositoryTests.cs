using Domain.Entites;
using Domain.Enums;
using Infrastructure.Repositories;
using PoupaBem.API.Tests.Common;

namespace PoupaBem.API.Tests.Infrastructure.Repositories;

public class CategoryRepositoryTests
{
    [Fact]
    public async Task ExistsByNameAsync_ShouldBeCaseInsensitiveAndScopedByUser()
    {
        await using var context = DbContextTestFactory.Create();

        var userA = Guid.NewGuid();
        var userB = Guid.NewGuid();

        context.Categories.AddRange(
            new Category("Moradia", TransactionType.Expense, userA),
            new Category("Moradia", TransactionType.Expense, userB));

        await context.SaveChangesAsync();

        var repository = new CategoryRepository(context);

        var existsForUserA = await repository.ExistsByNameAsync("MORADIA", userA, CancellationToken.None);
        var existsForUnknownUser = await repository.ExistsByNameAsync("moradia", Guid.NewGuid(), CancellationToken.None);

        Assert.True(existsForUserA);
        Assert.False(existsForUnknownUser);
    }

    [Fact]
    public async Task ExistsByNameForUserExcludingIdAsync_ShouldIgnoreExcludedCategory()
    {
        await using var context = DbContextTestFactory.Create();

        var userId = Guid.NewGuid();

        var transport = new Category("Transporte", TransactionType.Expense, userId);
        var market = new Category("Mercado", TransactionType.Expense, userId);

        context.Categories.AddRange(transport, market);
        await context.SaveChangesAsync();

        var repository = new CategoryRepository(context);

        var sameNameOnlyInExcluded = await repository.ExistsByNameForUserExcludingIdAsync(
            "transporte",
            userId,
            transport.Id,
            CancellationToken.None);

        var anotherCategoryWithSameName = await repository.ExistsByNameForUserExcludingIdAsync(
            "mercado",
            userId,
            transport.Id,
            CancellationToken.None);

        Assert.False(sameNameOnlyInExcluded);
        Assert.True(anotherCategoryWithSameName);
    }

    [Fact]
    public async Task CountTransactionsUsingCategoryAsync_ShouldReturnLinkedTransactionsCount()
    {
        await using var context = DbContextTestFactory.Create();

        var userId = Guid.NewGuid();
        var categoryId = Guid.NewGuid();

        var category = new Category("Moradia", TransactionType.Expense, userId);
        var otherCategory = new Category("Transporte", TransactionType.Expense, userId);

        context.Categories.AddRange(category, otherCategory);

        context.Transactions.AddRange(
            new Transaction("Aluguel", null, 1000m, TransactionType.Expense, category.Id, userId, DateTime.UtcNow),
            new Transaction("Condomínio", null, 500m, TransactionType.Expense, category.Id, userId, DateTime.UtcNow),
            new Transaction("Ônibus", null, 120m, TransactionType.Expense, otherCategory.Id, userId, DateTime.UtcNow));

        await context.SaveChangesAsync();

        var repository = new CategoryRepository(context);

        var count = await repository.CountTransactionsUsingCategoryAsync(category.Id, CancellationToken.None);

        Assert.Equal(2, count);
    }
}
