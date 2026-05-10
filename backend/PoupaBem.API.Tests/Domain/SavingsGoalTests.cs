using Domain.Entites;

namespace PoupaBem.API.Tests.Domain;

public class SavingsGoalTests
{
    [Fact]
    public void Constructor_ShouldThrow_WhenNameIsEmpty()
    {
        var ex = Assert.Throws<ApplicationException>(() => new SavingsGoal("  ", 1000m, Guid.NewGuid()));

        Assert.Equal("O nome do cofrinho é obrigatório.", ex.Message);
    }

    [Fact]
    public void Constructor_ShouldThrow_WhenTargetAmountIsInvalid()
    {
        var ex = Assert.Throws<ApplicationException>(() => new SavingsGoal("Reserva", 0m, Guid.NewGuid()));

        Assert.Equal("O valor-alvo deve ser maior que zero.", ex.Message);
    }

    [Fact]
    public void Update_ShouldSetTrimmedNameAndTargetAmount()
    {
        var goal = new SavingsGoal("Viagem", 5000m, Guid.NewGuid());

        goal.Update("  Casa  ", 120000m);

        Assert.Equal("Casa", goal.Name);
        Assert.Equal(120000m, goal.TargetAmount);
        Assert.NotNull(goal.UpdatedAt);
    }

    [Fact]
    public void Deposit_ShouldThrow_WhenAmountIsLessOrEqualToZero()
    {
        var goal = new SavingsGoal("Reserva", 1000m, Guid.NewGuid());

        var ex = Assert.Throws<ApplicationException>(() => goal.Deposit(0m));

        Assert.Equal("O valor do aporte deve ser maior que zero.", ex.Message);
    }

    [Fact]
    public void Deposit_ShouldIncreaseCurrentAmount_WhenAmountIsValid()
    {
        var goal = new SavingsGoal("Reserva", 1000m, Guid.NewGuid());

        goal.Deposit(250m);

        Assert.Equal(250m, goal.CurrentAmount);
        Assert.NotNull(goal.UpdatedAt);
    }
}
