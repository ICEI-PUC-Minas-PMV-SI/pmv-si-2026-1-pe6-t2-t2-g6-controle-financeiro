using Application.DTOs.Reports;

namespace Application.Interfaces.Repositories;

public interface IFinancialReportRepository
{
    Task<FinancialSummaryResponse> GetSummaryAsync(Guid userId, DateTime? fromUtc, DateTime? toUtc, CancellationToken cancellationToken);
    Task<IReadOnlyList<CategoryExpenseReportItem>> GetExpenseTotalsByCategoryAsync(Guid userId, DateTime? fromUtc, DateTime? toUtc, CancellationToken cancellationToken);
}
