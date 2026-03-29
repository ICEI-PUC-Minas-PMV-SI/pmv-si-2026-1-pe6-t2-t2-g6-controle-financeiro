using Domain.Entites;

namespace Application.Interfaces.Repositories;

public interface ICategoryRepository
{
    Task AddAsync(Category category, CancellationToken cancellationToken);
    Task<List<Category>> GetByUserAsync(Guid userId, CancellationToken cancellationToken);
    Task<Category?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<bool> ExistsByNameAsync(string name, Guid? userId, CancellationToken cancellationToken);
}
