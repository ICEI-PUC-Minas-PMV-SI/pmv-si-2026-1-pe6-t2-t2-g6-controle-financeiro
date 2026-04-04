using Domain.Entites;

namespace Application.Interfaces.Repositories;

public interface ISavingsGoalRepository
{
    Task AddAsync(SavingsGoal goal, CancellationToken cancellationToken);
    Task<List<SavingsGoal>> GetByUserAsync(Guid userId, CancellationToken cancellationToken);
    Task<SavingsGoal?> GetByIdForUserAsync(Guid id, Guid userId, CancellationToken cancellationToken);
    Task<SavingsGoal?> GetTrackedByIdForUserAsync(Guid id, Guid userId, CancellationToken cancellationToken);
    Task DeleteAsync(SavingsGoal goal, CancellationToken cancellationToken);
    Task SaveChangesAsync(CancellationToken cancellationToken);
}
