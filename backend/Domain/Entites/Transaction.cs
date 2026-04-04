using Domain.Enums;

namespace Domain.Entites;

public class Transaction
{
    public Guid Id { get; private set; }
    public string Title { get; private set; }
    public string? Description { get; private set; }
    public decimal Amount { get; private set; }
    public TransactionType TransactionType { get; private set; }
    public Guid CategoryId { get; private set; }
    public Guid UserId { get; private set; }
    public DateTime OcurredAt { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    protected Transaction() { }

    public Transaction(
        string title,
        string? description,
        decimal amount,
        TransactionType transactionType,
        Guid categoryId,
        Guid userId,
        DateTime ocurredAt)
    {
        if( string.IsNullOrWhiteSpace(title))
            throw new ApplicationException("O titulo da transação é obrigatório.");

        if ( amount <= 0 )
            throw new ApplicationException("O valor da transação deve ser maior que zero.");

        if (categoryId == Guid.Empty)
            throw new ApplicationException("A categoria é obrigatória.");

        if (userId == Guid.Empty)
            throw new ApplicationException("O usuário é obrigatório.");

        Id = Guid.NewGuid();
        Title = title.Trim();
        Description = string.IsNullOrWhiteSpace(description) ? null : description.Trim();
        Amount = amount;
        TransactionType = transactionType;
        CategoryId = categoryId;
        UserId = userId;
        OcurredAt = ocurredAt;
        CreatedAt = DateTime.UtcNow;
    }

    public void Update(
        string title,
        string? description,
        decimal amount,
        TransactionType transactionType,
        Guid categoryId,
        DateTime ocurredAt)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new ApplicationException("O titulo da transação é obrigatório.");

        if (amount <= 0)
            throw new ApplicationException("O valor da transação deve ser maior que zero.");

        if (categoryId == Guid.Empty)
            throw new ApplicationException("A categoria é obrigatória.");

        Title = title.Trim();
        Description = string.IsNullOrWhiteSpace(description) ? null : description.Trim();
        Amount = amount;
        TransactionType = transactionType;
        CategoryId = categoryId;
        OcurredAt = ocurredAt;
        UpdatedAt = DateTime.UtcNow;
    }
}
