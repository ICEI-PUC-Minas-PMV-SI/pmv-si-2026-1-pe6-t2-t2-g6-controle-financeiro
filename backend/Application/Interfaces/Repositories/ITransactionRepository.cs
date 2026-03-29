using Domain.Entites;

namespace Application.Interfaces.Repositories;

public interface ITransactionRepository
{
    Task AddAsync(Transaction transaction, CancellationToken cancellationToken);
    Task<List<Transaction>> GetByUserAsync(Guid userId, CancellationToken cancellationToken);
    Task<Transaction?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
}
