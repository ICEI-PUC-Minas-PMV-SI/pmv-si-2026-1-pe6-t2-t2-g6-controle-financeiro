using Application.DTOs.Categories;
using Application.Interfaces.Repositories;
using Domain.Entites;
using Domain.Enums;
using Microsoft.AspNetCore.Mvc;
using Moq;
using PoupaBem.API.Controllers;
using PoupaBem.API.Tests.Common;

namespace PoupaBem.API.Tests.Controllers;

public class CategoriesControllerTests
{
    [Fact]
    public async Task Create_ShouldReturnUnauthorized_WhenUserClaimIsMissing()
    {
        var controller = new CategoriesController();
        ControllerTestHelper.SetUser(controller, null);

        var repositoryMock = new Mock<ICategoryRepository>();

        var request = new CreateCategoryRequest
        {
            Name = "Alimentação",
            Type = TransactionType.Expense
        };

        var result = await controller.Create(repositoryMock.Object, request, CancellationToken.None);

        Assert.IsType<UnauthorizedResult>(result);
        repositoryMock.Verify(x => x.AddAsync(It.IsAny<Category>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task Delete_ShouldThrow_WhenCategoryHasLinkedTransactions()
    {
        var controller = new CategoriesController();
        var userId = Guid.NewGuid();
        var categoryId = Guid.NewGuid();
        ControllerTestHelper.SetUser(controller, userId);

        var repositoryMock = new Mock<ICategoryRepository>();
        var category = new Category("Moradia", TransactionType.Expense, userId);

        repositoryMock
            .Setup(x => x.GetOwnedTrackedByIdAsync(categoryId, userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(category);

        repositoryMock
            .Setup(x => x.CountTransactionsUsingCategoryAsync(categoryId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        var ex = await Assert.ThrowsAsync<ApplicationException>(() =>
            controller.Delete(categoryId, repositoryMock.Object, CancellationToken.None));

        Assert.Equal("Não é possível excluir: existem transações vinculadas a esta categoria.", ex.Message);
        repositoryMock.Verify(x => x.DeleteAsync(It.IsAny<Category>(), It.IsAny<CancellationToken>()), Times.Never);
    }
}
