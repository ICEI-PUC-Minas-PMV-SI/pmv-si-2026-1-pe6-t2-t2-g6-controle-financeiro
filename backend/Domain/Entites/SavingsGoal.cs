namespace Domain.Entites;

public class SavingsGoal
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public string Name { get; private set; } = null!;
    public decimal TargetAmount { get; private set; }
    public decimal CurrentAmount { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    protected SavingsGoal() { }

    public SavingsGoal(string name, decimal targetAmount, Guid userId)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ApplicationException("O nome do cofrinho é obrigatório.");

        if (targetAmount <= 0)
            throw new ApplicationException("O valor-alvo deve ser maior que zero.");

        if (userId == Guid.Empty)
            throw new ApplicationException("O usuário é obrigatório.");

        Id = Guid.NewGuid();
        Name = name.Trim();
        TargetAmount = targetAmount;
        CurrentAmount = 0;
        UserId = userId;
        CreatedAt = DateTime.UtcNow;
    }

    public void Update(string name, decimal targetAmount)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ApplicationException("O nome do cofrinho é obrigatório.");

        if (targetAmount <= 0)
            throw new ApplicationException("O valor-alvo deve ser maior que zero.");

        Name = name.Trim();
        TargetAmount = targetAmount;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Deposit(decimal amount)
    {
        if (amount <= 0)
            throw new ApplicationException("O valor do aporte deve ser maior que zero.");

        CurrentAmount += amount;
        UpdatedAt = DateTime.UtcNow;
    }
}
