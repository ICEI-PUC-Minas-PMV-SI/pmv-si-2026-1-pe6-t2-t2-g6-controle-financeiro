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

    public async Task<bool> ExistsByNameForUserExcludingIdAsync(
        string name,
        Guid userId,
        Guid excludeCategoryId,
        CancellationToken cancellationToken)
    {
        return await _context.Categories
            .AsNoTracking()
            .AnyAsync(
                x => x.UserId == userId
                    && x.Id != excludeCategoryId
                    && x.Name.ToLower() == name.ToLower(),
                cancellationToken);
    }

    public async Task<Category?> GetByIdForUserAsync(Guid id, Guid userId, CancellationToken cancellationToken)
    {
        return await _context.Categories
            .AsNoTracking()
            .FirstOrDefaultAsync(
                x => x.Id == id && (x.UserId == null || x.UserId == userId),
                cancellationToken);
    }

    public async Task<Category?> GetOwnedTrackedByIdAsync(Guid id, Guid userId, CancellationToken cancellationToken)
    {
        return await _context.Categories
            .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId, cancellationToken);
    }

    public async Task<List<Category>> GetByUserAsync(Guid userId, CancellationToken cancellationToken)
    {
        return await _context.Categories
            .AsNoTracking()
            .Where(x => x.UserId == null || x.UserId == userId)
            .OrderBy(x => x.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<int> CountTransactionsUsingCategoryAsync(Guid categoryId, CancellationToken cancellationToken)
    {
        return await _context.Transactions
            .AsNoTracking()
            .CountAsync(x => x.CategoryId == categoryId, cancellationToken);
    }

    public async Task DeleteAsync(Category category, CancellationToken cancellationToken)
    {
        _context.Categories.Remove(category);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}
