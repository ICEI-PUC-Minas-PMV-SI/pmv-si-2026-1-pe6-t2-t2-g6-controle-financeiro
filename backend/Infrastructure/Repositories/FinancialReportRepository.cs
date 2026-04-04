using Application.DTOs.Reports;
using Application.Interfaces.Repositories;
using Domain.Enums;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class FinancialReportRepository(ApplicationDbContext context) : IFinancialReportRepository
{
    private readonly ApplicationDbContext _context = context;

    public async Task<FinancialSummaryResponse> GetSummaryAsync(
        Guid userId,
        DateTime? fromUtc,
        DateTime? toUtc,
        CancellationToken cancellationToken)
    {
        var baseQuery = _context.Transactions.AsNoTracking().Where(x => x.UserId == userId);

        if (fromUtc.HasValue)
            baseQuery = baseQuery.Where(x => x.OcurredAt >= fromUtc.Value);

        if (toUtc.HasValue)
            baseQuery = baseQuery.Where(x => x.OcurredAt <= toUtc.Value);

        var totalIncome = await baseQuery
            .Where(x => x.TransactionType == TransactionType.Income)
            .SumAsync(x => x.Amount, cancellationToken);

        var totalExpense = await baseQuery
            .Where(x => x.TransactionType == TransactionType.Expense)
            .SumAsync(x => x.Amount, cancellationToken);

        return new FinancialSummaryResponse
        {
            TotalIncome = totalIncome,
            TotalExpense = totalExpense,
            Balance = totalIncome - totalExpense
        };
    }

    public async Task<IReadOnlyList<CategoryExpenseReportItem>> GetExpenseTotalsByCategoryAsync(
        Guid userId,
        DateTime? fromUtc,
        DateTime? toUtc,
        CancellationToken cancellationToken)
    {
        var query =
            from t in _context.Transactions.AsNoTracking()
            join c in _context.Categories.AsNoTracking() on t.CategoryId equals c.Id
            where t.UserId == userId && t.TransactionType == TransactionType.Expense
            select new { t, c };

        if (fromUtc.HasValue)
            query = query.Where(x => x.t.OcurredAt >= fromUtc.Value);

        if (toUtc.HasValue)
            query = query.Where(x => x.t.OcurredAt <= toUtc.Value);

        var grouped = await query
            .GroupBy(x => new { x.c.Id, x.c.Name })
            .Select(g => new CategoryExpenseReportItem
            {
                CategoryId = g.Key.Id,
                CategoryName = g.Key.Name,
                TotalAmount = g.Sum(x => x.t.Amount)
            })
            .OrderByDescending(x => x.TotalAmount)
            .ToListAsync(cancellationToken);

        return grouped;
    }
}
