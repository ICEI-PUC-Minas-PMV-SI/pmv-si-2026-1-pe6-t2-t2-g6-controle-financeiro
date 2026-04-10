using Domain.Entites;
using Infrastructure.Repositories;
using PoupaBem.API.Tests.Common;

namespace PoupaBem.API.Tests.Infrastructure.Repositories;

public class SavingsGoalRepositoryTests
{
    [Fact]
    public async Task GetByUserAsync_ShouldReturnOnlyGoalsFromUserOrderedByName()
    {
        await using var context = DbContextTestFactory.Create();

        var userId = Guid.NewGuid();
        var otherUserId = Guid.NewGuid();

        context.SavingsGoals.AddRange(
            new SavingsGoal("Viagem", 5000m, userId),
            new SavingsGoal("Aposentadoria", 200000m, userId),
            new SavingsGoal("Outro usuário", 1000m, otherUserId));

        await context.SaveChangesAsync();

        var repository = new SavingsGoalRepository(context);

        var result = await repository.GetByUserAsync(userId, CancellationToken.None);

        Assert.Equal(2, result.Count);
        Assert.Equal("Aposentadoria", result[0].Name);
        Assert.Equal("Viagem", result[1].Name);
    }

    [Fact]
    public async Task GetByIdForUserAsync_ShouldReturnNull_WhenGoalBelongsToAnotherUser()
    {
        await using var context = DbContextTestFactory.Create();

        var ownerId = Guid.NewGuid();
        var otherUserId = Guid.NewGuid();

        var goal = new SavingsGoal("Casa", 80000m, ownerId);
        context.SavingsGoals.Add(goal);
        await context.SaveChangesAsync();

        var repository = new SavingsGoalRepository(context);

        var result = await repository.GetByIdForUserAsync(goal.Id, otherUserId, CancellationToken.None);

        Assert.Null(result);
    }

    [Fact]
    public async Task GetTrackedByIdForUserAsync_ShouldReturnGoal_WhenGoalBelongsToUser()
    {
        await using var context = DbContextTestFactory.Create();

        var userId = Guid.NewGuid();

        var goal = new SavingsGoal("Reserva", 3000m, userId);
        context.SavingsGoals.Add(goal);
        await context.SaveChangesAsync();

        var repository = new SavingsGoalRepository(context);

        var result = await repository.GetTrackedByIdForUserAsync(goal.Id, userId, CancellationToken.None);

        Assert.NotNull(result);
        Assert.Equal(goal.Id, result.Id);
        Assert.Equal("Reserva", result.Name);
    }
}
