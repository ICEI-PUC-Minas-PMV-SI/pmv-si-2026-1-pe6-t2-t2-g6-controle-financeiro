using Domain.Entites;
using Domain.Enums;

namespace Application.Interfaces.Repositories;

public interface ITransactionRepository
{
    Task AddAsync(Transaction transaction, CancellationToken cancellationToken);
    Task<List<Transaction>> GetByUserAsync(Guid userId, CancellationToken cancellationToken);
    Task<List<Transaction>> GetFilteredAsync(
        Guid userId,
        DateTime? fromUtc,
        DateTime? toUtc,
        Guid? categoryId,
        TransactionType? transactionType,
        CancellationToken cancellationToken);
    Task<Transaction?> GetTrackedByIdForUserAsync(Guid id, Guid userId, CancellationToken cancellationToken);
    Task DeleteAsync(Transaction transaction, CancellationToken cancellationToken);
    Task SaveChangesAsync(CancellationToken cancellationToken);
}
