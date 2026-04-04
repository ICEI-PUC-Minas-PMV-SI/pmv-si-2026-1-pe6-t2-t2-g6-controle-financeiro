using Domain.Entites;

namespace Application.Interfaces.Repositories;

public interface ICategoryRepository
{
    Task AddAsync(Category category, CancellationToken cancellationToken);
    Task<List<Category>> GetByUserAsync(Guid userId, CancellationToken cancellationToken);
    Task<Category?> GetByIdForUserAsync(Guid id, Guid userId, CancellationToken cancellationToken);
    Task<Category?> GetOwnedTrackedByIdAsync(Guid id, Guid userId, CancellationToken cancellationToken);
    Task<bool> ExistsByNameAsync(string name, Guid? userId, CancellationToken cancellationToken);
    Task<bool> ExistsByNameForUserExcludingIdAsync(string name, Guid userId, Guid excludeCategoryId, CancellationToken cancellationToken);
    Task<int> CountTransactionsUsingCategoryAsync(Guid categoryId, CancellationToken cancellationToken);
    Task DeleteAsync(Category category, CancellationToken cancellationToken);
    Task SaveChangesAsync(CancellationToken cancellationToken);
}
