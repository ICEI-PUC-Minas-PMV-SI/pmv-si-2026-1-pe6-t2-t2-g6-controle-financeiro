using Application.DTOs.Goals;
using Application.Interfaces.Repositories;
using Domain.Entites;
using Microsoft.AspNetCore.Mvc;
using Moq;
using PoupaBem.API.Controllers;
using PoupaBem.API.Tests.Common;

namespace PoupaBem.API.Tests.Controllers;

public class SavingsGoalsControllerTests
{
    [Fact]
    public async Task Create_ShouldReturnUnauthorized_WhenUserClaimIsMissing()
    {
        var controller = new SavingsGoalsController();
        ControllerTestHelper.SetUser(controller, null);

        var repositoryMock = new Mock<ISavingsGoalRepository>();

        var request = new CreateSavingsGoalRequest
        {
            Name = "Reserva",
            TargetAmount = 1000m
        };

        var result = await controller.Create(repositoryMock.Object, request, CancellationToken.None);

        Assert.IsType<UnauthorizedResult>(result);
        repositoryMock.Verify(x => x.AddAsync(It.IsAny<SavingsGoal>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task Delete_ShouldReturnNoContent_WhenGoalExists()
    {
        var controller = new SavingsGoalsController();
        var userId = Guid.NewGuid();
        var goalId = Guid.NewGuid();
        ControllerTestHelper.SetUser(controller, userId);

        var repositoryMock = new Mock<ISavingsGoalRepository>();
        var goal = new SavingsGoal("Férias", 5000m, userId);

        repositoryMock
            .Setup(x => x.GetTrackedByIdForUserAsync(goalId, userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(goal);

        var result = await controller.Delete(goalId, repositoryMock.Object, CancellationToken.None);

        Assert.IsType<NoContentResult>(result);
        repositoryMock.Verify(x => x.DeleteAsync(goal, It.IsAny<CancellationToken>()), Times.Once);
    }
}
