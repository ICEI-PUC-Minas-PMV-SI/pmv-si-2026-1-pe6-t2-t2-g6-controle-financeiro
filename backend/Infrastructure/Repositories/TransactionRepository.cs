using Application.Interfaces.Repositories;
using Domain.Entites;
using Domain.Enums;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class TransactionRepository(ApplicationDbContext context) : ITransactionRepository
{
    private readonly ApplicationDbContext _context = context;

    public async Task AddAsync(Transaction transaction, CancellationToken cancellationToken)
    {
        await _context.Transactions.AddAsync(transaction, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<List<Transaction>> GetByUserAsync(Guid userId, CancellationToken cancellationToken)
    {
        return await _context.Transactions
            .AsNoTracking()
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.OcurredAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<Transaction>> GetFilteredAsync(
        Guid userId,
        DateTime? fromUtc,
        DateTime? toUtc,
        Guid? categoryId,
        TransactionType? transactionType,
        CancellationToken cancellationToken)
    {
        var query = _context.Transactions
            .AsNoTracking()
            .Where(x => x.UserId == userId);

        if (fromUtc.HasValue)
            query = query.Where(x => x.OcurredAt >= fromUtc.Value);

        if (toUtc.HasValue)
            query = query.Where(x => x.OcurredAt <= toUtc.Value);

        if (categoryId.HasValue)
            query = query.Where(x => x.CategoryId == categoryId.Value);

        if (transactionType.HasValue)
            query = query.Where(x => x.TransactionType == transactionType.Value);

        return await query
            .OrderByDescending(x => x.OcurredAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<Transaction?> GetTrackedByIdForUserAsync(Guid id, Guid userId, CancellationToken cancellationToken)
    {
        return await _context.Transactions
            .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId, cancellationToken);
    }

    public async Task DeleteAsync(Transaction transaction, CancellationToken cancellationToken)
    {
        _context.Transactions.Remove(transaction);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}
