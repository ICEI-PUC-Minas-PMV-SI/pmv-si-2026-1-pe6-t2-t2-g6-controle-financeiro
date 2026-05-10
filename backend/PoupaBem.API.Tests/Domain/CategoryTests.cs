using Domain.Entites;
using Domain.Enums;

namespace PoupaBem.API.Tests.Domain;

public class CategoryTests
{
    [Fact]
    public void Constructor_ShouldThrow_WhenNameIsEmpty()
    {
        var ex = Assert.Throws<ApplicationException>(() => new Category("   ", TransactionType.Expense, Guid.NewGuid()));

        Assert.Equal("O nome da categoria é obrigatório.", ex.Message);
    }

    [Fact]
    public void Constructor_ShouldTrimNameAndSetProperties_WhenInputIsValid()
    {
        var userId = Guid.NewGuid();

        var category = new Category("  Alimentação  ", TransactionType.Expense, userId);

        Assert.Equal("Alimentação", category.Name);
        Assert.Equal(TransactionType.Expense, category.Type);
        Assert.Equal(userId, category.UserId);
        Assert.NotEqual(Guid.Empty, category.Id);
    }

    [Fact]
    public void Update_ShouldThrow_WhenNameIsEmpty()
    {
        var category = new Category("Mercado", TransactionType.Expense, Guid.NewGuid());

        var ex = Assert.Throws<ApplicationException>(() => category.Update("", TransactionType.Income));

        Assert.Equal("O nome da categoria é obrigatório.", ex.Message);
    }

    [Fact]
    public void Update_ShouldChangeNameAndType_WhenInputIsValid()
    {
        var category = new Category("Mercado", TransactionType.Expense, Guid.NewGuid());

        category.Update("  Salário  ", TransactionType.Income);

        Assert.Equal("Salário", category.Name);
        Assert.Equal(TransactionType.Income, category.Type);
    }
}
