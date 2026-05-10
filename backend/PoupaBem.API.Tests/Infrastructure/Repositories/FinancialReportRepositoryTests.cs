using Domain.Entites;
using Domain.Enums;
using Infrastructure.Repositories;
using PoupaBem.API.Tests.Common;

namespace PoupaBem.API.Tests.Infrastructure.Repositories;

public class FinancialReportRepositoryTests
{
    [Fact]
    public async Task GetSummaryAsync_ShouldApplyPeriodAndUserFilter()
    {
        await using var context = DbContextTestFactory.Create();

        var userId = Guid.NewGuid();
        var otherUserId = Guid.NewGuid();

        var incomeCategory = new Category("Salário", TransactionType.Income, userId);
        var expenseCategory = new Category("Moradia", TransactionType.Expense, userId);
        var otherUserCategory = new Category("Outros", TransactionType.Expense, otherUserId);

        context.Categories.AddRange(incomeCategory, expenseCategory, otherUserCategory);

        context.Transactions.AddRange(
            new Transaction("Salário Jan", null, 3000m, TransactionType.Income, incomeCategory.Id, userId, new DateTime(2026, 1, 5, 0, 0, 0, DateTimeKind.Utc)),
            new Transaction("Aluguel Jan", null, 1200m, TransactionType.Expense, expenseCategory.Id, userId, new DateTime(2026, 1, 10, 0, 0, 0, DateTimeKind.Utc)),
            new Transaction("Aluguel Fev", null, 1200m, TransactionType.Expense, expenseCategory.Id, userId, new DateTime(2026, 2, 10, 0, 0, 0, DateTimeKind.Utc)),
            new Transaction("Outro usuário", null, 999m, TransactionType.Expense, otherUserCategory.Id, otherUserId, new DateTime(2026, 1, 10, 0, 0, 0, DateTimeKind.Utc)));

        await context.SaveChangesAsync();

        var repository = new FinancialReportRepository(context);

        var summary = await repository.GetSummaryAsync(
            userId,
            new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc),
            new DateTime(2026, 1, 31, 23, 59, 59, DateTimeKind.Utc),
            CancellationToken.None);

        Assert.Equal(3000m, summary.TotalIncome);
        Assert.Equal(1200m, summary.TotalExpense);
        Assert.Equal(1800m, summary.Balance);
    }

    [Fact]
    public async Task GetExpenseTotalsByCategoryAsync_ShouldGroupByCategoryAndOrderDescending()
    {
        await using var context = DbContextTestFactory.Create();

        var userId = Guid.NewGuid();
        var otherUserId = Guid.NewGuid();

        var housing = new Category("Moradia", TransactionType.Expense, userId);
        var transport = new Category("Transporte", TransactionType.Expense, userId);
        var salary = new Category("Salário", TransactionType.Income, userId);
        var otherCategory = new Category("Outro", TransactionType.Expense, otherUserId);

        context.Categories.AddRange(housing, transport, salary, otherCategory);

        context.Transactions.AddRange(
            new Transaction("Aluguel", null, 1000m, TransactionType.Expense, housing.Id, userId, new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc)),
            new Transaction("Condomínio", null, 500m, TransactionType.Expense, housing.Id, userId, new DateTime(2026, 3, 3, 0, 0, 0, DateTimeKind.Utc)),
            new Transaction("Ônibus", null, 200m, TransactionType.Expense, transport.Id, userId, new DateTime(2026, 3, 2, 0, 0, 0, DateTimeKind.Utc)),
            new Transaction("Salário", null, 7000m, TransactionType.Income, salary.Id, userId, new DateTime(2026, 3, 5, 0, 0, 0, DateTimeKind.Utc)),
            new Transaction("Despesa outro usuário", null, 900m, TransactionType.Expense, otherCategory.Id, otherUserId, new DateTime(2026, 3, 2, 0, 0, 0, DateTimeKind.Utc)));

        await context.SaveChangesAsync();

        var repository = new FinancialReportRepository(context);

        var items = await repository.GetExpenseTotalsByCategoryAsync(userId, null, null, CancellationToken.None);

        Assert.Equal(2, items.Count);
        Assert.Equal("Moradia", items[0].CategoryName);
        Assert.Equal(1500m, items[0].TotalAmount);
        Assert.Equal("Transporte", items[1].CategoryName);
        Assert.Equal(200m, items[1].TotalAmount);
    }
}
