using Domain.Enums;

namespace Domain.Entites;

public class Category
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public TransactionType Type { get; private set; }
    public Guid? UserId { get; private set; }
    public DateTime CreatedAt { get; private set; }

    protected Category() { }

    public Category(string name, TransactionType type, Guid? userId = null)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ApplicationException("O nome da categoria é obrigatório.");

        Id = Guid.NewGuid();
        Name = name.Trim();
        Type = type;
        UserId = userId;
        CreatedAt = DateTime.UtcNow;
    }

    public void Update(string name, TransactionType type)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ApplicationException("O nome da categoria é obrigatório.");

        Name = name.Trim();
        Type = type;
    }
}
