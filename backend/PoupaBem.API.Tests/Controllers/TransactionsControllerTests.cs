using Application.DTOs.Transactions;
using Application.Interfaces.Repositories;
using Domain.Entites;
using Domain.Enums;
using Moq;
using PoupaBem.API.Controllers;
using PoupaBem.API.Tests.Common;

namespace PoupaBem.API.Tests.Controllers;

public class TransactionsControllerTests
{
    [Fact]
    public async Task Create_ShouldThrow_WhenCategoryTypeIsDifferentFromRequestType()
    {
        var controller = new TransactionsController();
        var userId = Guid.NewGuid();
        var categoryId = Guid.NewGuid();
        ControllerTestHelper.SetUser(controller, userId);

        var transactionRepositoryMock = new Mock<ITransactionRepository>();
        var categoryRepositoryMock = new Mock<ICategoryRepository>();

        var category = new Category("Salário", TransactionType.Income, userId);
        categoryRepositoryMock
            .Setup(x => x.GetByIdForUserAsync(categoryId, userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(category);

        var request = new CreateTransactionRequest
        {
            Title = "Conta de Luz",
            Description = "Abril",
            Amount = 220m,
            TransactionType = TransactionType.Expense,
            CategoryId = categoryId,
            OcurredAt = DateTime.UtcNow
        };

        var ex = await Assert.ThrowsAsync<ApplicationException>(() =>
            controller.Create(transactionRepositoryMock.Object, categoryRepositoryMock.Object, request, CancellationToken.None));

        Assert.Equal("O tipo da transação deve ser o mesmo tipo da categoria", ex.Message);
        transactionRepositoryMock.Verify(x => x.AddAsync(It.IsAny<Transaction>(), It.IsAny<CancellationToken>()), Times.Never);
    }
}
