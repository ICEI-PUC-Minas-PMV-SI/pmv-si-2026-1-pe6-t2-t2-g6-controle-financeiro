using Application.Interfaces.Repositories;
using Domain.Entites;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class SavingsGoalRepository(ApplicationDbContext context) : ISavingsGoalRepository
{
    private readonly ApplicationDbContext _context = context;

    public async Task AddAsync(SavingsGoal goal, CancellationToken cancellationToken)
    {
        await _context.SavingsGoals.AddAsync(goal, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<List<SavingsGoal>> GetByUserAsync(Guid userId, CancellationToken cancellationToken)
    {
        return await _context.SavingsGoals
            .AsNoTracking()
            .Where(x => x.UserId == userId)
            .OrderBy(x => x.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<SavingsGoal?> GetByIdForUserAsync(Guid id, Guid userId, CancellationToken cancellationToken)
    {
        return await _context.SavingsGoals
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId, cancellationToken);
    }

    public async Task<SavingsGoal?> GetTrackedByIdForUserAsync(Guid id, Guid userId, CancellationToken cancellationToken)
    {
        return await _context.SavingsGoals
            .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId, cancellationToken);
    }

    public async Task DeleteAsync(SavingsGoal goal, CancellationToken cancellationToken)
    {
        _context.SavingsGoals.Remove(goal);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}
