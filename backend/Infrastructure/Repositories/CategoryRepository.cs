using Application.Interfaces.Repositories;
using Domain.Entites;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class CategoryRepository(ApplicationDbContext context) : ICategoryRepository
{
    private readonly ApplicationDbContext _context = context;
    public async Task AddAsync(Category category, CancellationToken cancellationToken)
    {
        await _context.Categories.AddAsync(category, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> ExistsByNameAsync(string name, Guid? userId, CancellationToken cancellationToken)
    {
        return await _context.Categories
            .AsNoTracking()
            .AnyAsync(x => x.Name.ToLower() == name.ToLower() && x.UserId == userId, cancellationToken);
    }

    public async Task<Category?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _context.Categories
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<List<Category>> GetByUserAsync(Guid userId, CancellationToken cancellationToken)
    {
        return await _context.Categories
            .AsNoTracking()
            .Where(x => x.UserId == null ||  x.UserId == userId)
            .OrderBy(x => x.Name)
            .ToListAsync(cancellationToken);
    }
}
