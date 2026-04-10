using Domain.Entites;
using Domain.Enums;

namespace PoupaBem.API.Tests.Domain;

public class TransactionTests
{
    [Fact]
    public void Constructor_ShouldThrow_WhenTitleIsEmpty()
    {
        var ex = Assert.Throws<ApplicationException>(() =>
            new Transaction("   ", "desc", 10m, TransactionType.Expense, Guid.NewGuid(), Guid.NewGuid(), DateTime.UtcNow));

        Assert.Equal("O titulo da transação é obrigatório.", ex.Message);
    }

    [Fact]
    public void Constructor_ShouldThrow_WhenAmountIsInvalid()
    {
        var ex = Assert.Throws<ApplicationException>(() =>
            new Transaction("Conta", "desc", 0m, TransactionType.Expense, Guid.NewGuid(), Guid.NewGuid(), DateTime.UtcNow));

        Assert.Equal("O valor da transação deve ser maior que zero.", ex.Message);
    }

    [Fact]
    public void Constructor_ShouldThrow_WhenCategoryIdIsEmpty()
    {
        var ex = Assert.Throws<ApplicationException>(() =>
            new Transaction("Conta", "desc", 10m, TransactionType.Expense, Guid.Empty, Guid.NewGuid(), DateTime.UtcNow));

        Assert.Equal("A categoria é obrigatória.", ex.Message);
    }

    [Fact]
    public void Constructor_ShouldThrow_WhenUserIdIsEmpty()
    {
        var ex = Assert.Throws<ApplicationException>(() =>
            new Transaction("Conta", "desc", 10m, TransactionType.Expense, Guid.NewGuid(), Guid.Empty, DateTime.UtcNow));

        Assert.Equal("O usuário é obrigatório.", ex.Message);
    }

    [Fact]
    public void Update_ShouldSetPropertiesAndUpdatedAt_WhenInputIsValid()
    {
        var transaction = new Transaction(
            "Conta antiga",
            "descricao",
            100m,
            TransactionType.Expense,
            Guid.NewGuid(),
            Guid.NewGuid(),
            DateTime.UtcNow.AddDays(-1));

        var newDate = DateTime.UtcNow;
        var newCategoryId = Guid.NewGuid();

        transaction.Update("  Conta nova  ", "  abril  ", 150m, TransactionType.Expense, newCategoryId, newDate);

        Assert.Equal("Conta nova", transaction.Title);
        Assert.Equal("abril", transaction.Description);
        Assert.Equal(150m, transaction.Amount);
        Assert.Equal(TransactionType.Expense, transaction.TransactionType);
        Assert.Equal(newCategoryId, transaction.CategoryId);
        Assert.Equal(newDate, transaction.OcurredAt);
        Assert.NotNull(transaction.UpdatedAt);
    }
}
