using Application.DTOs.Goals;
using Application.Interfaces.Repositories;
using Domain.Entites;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace PoupaBem.API.Controllers;

[ApiController]
[Route("api/savings-goals")]
[Authorize]
public class SavingsGoalsController : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromServices] ISavingsGoalRepository savingsGoalRepository,
        [FromBody] CreateSavingsGoalRequest request,
        CancellationToken cancellationToken)
    {
        var userIdValue = User.FindFirst("sub")?.Value;

        if (!Guid.TryParse(userIdValue, out var userId))
            return Unauthorized();

        var goal = new SavingsGoal(request.Name, request.TargetAmount, userId);
        await savingsGoalRepository.AddAsync(goal, cancellationToken);

        return Ok(ToResponse(goal));
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromServices] ISavingsGoalRepository savingsGoalRepository,
        CancellationToken cancellationToken)
    {
        var userIdValue = User.FindFirst("sub")?.Value;

        if (!Guid.TryParse(userIdValue, out var userId))
            return Unauthorized();

        var goals = await savingsGoalRepository.GetByUserAsync(userId, cancellationToken);
        return Ok(goals.Select(ToResponse));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(
        Guid id,
        [FromServices] ISavingsGoalRepository savingsGoalRepository,
        CancellationToken cancellationToken)
    {
        var userIdValue = User.FindFirst("sub")?.Value;

        if (!Guid.TryParse(userIdValue, out var userId))
            return Unauthorized();

        var goal = await savingsGoalRepository.GetByIdForUserAsync(id, userId, cancellationToken)
            ?? throw new ApplicationException("Cofrinho não encontrado.");

        return Ok(ToResponse(goal));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        [FromServices] ISavingsGoalRepository savingsGoalRepository,
        [FromBody] UpdateSavingsGoalRequest request,
        CancellationToken cancellationToken)
    {
        var userIdValue = User.FindFirst("sub")?.Value;

        if (!Guid.TryParse(userIdValue, out var userId))
            return Unauthorized();

        var goal = await savingsGoalRepository.GetTrackedByIdForUserAsync(id, userId, cancellationToken)
            ?? throw new ApplicationException("Cofrinho não encontrado.");

        goal.Update(request.Name, request.TargetAmount);
        await savingsGoalRepository.SaveChangesAsync(cancellationToken);

        return Ok(ToResponse(goal));
    }

    [HttpPost("{id:guid}/deposit")]
    public async Task<IActionResult> Deposit(
        Guid id,
        [FromServices] ISavingsGoalRepository savingsGoalRepository,
        [FromBody] DepositSavingsGoalRequest request,
        CancellationToken cancellationToken)
    {
        var userIdValue = User.FindFirst("sub")?.Value;

        if (!Guid.TryParse(userIdValue, out var userId))
            return Unauthorized();

        var goal = await savingsGoalRepository.GetTrackedByIdForUserAsync(id, userId, cancellationToken)
            ?? throw new ApplicationException("Cofrinho não encontrado.");

        goal.Deposit(request.Amount);
        await savingsGoalRepository.SaveChangesAsync(cancellationToken);

        return Ok(ToResponse(goal));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(
        Guid id,
        [FromServices] ISavingsGoalRepository savingsGoalRepository,
        CancellationToken cancellationToken)
    {
        var userIdValue = User.FindFirst("sub")?.Value;

        if (!Guid.TryParse(userIdValue, out var userId))
            return Unauthorized();

        var goal = await savingsGoalRepository.GetTrackedByIdForUserAsync(id, userId, cancellationToken)
            ?? throw new ApplicationException("Cofrinho não encontrado.");

        await savingsGoalRepository.DeleteAsync(goal, cancellationToken);

        return NoContent();
    }

    private static SavingsGoalResponse ToResponse(SavingsGoal g)
    {
        var progress = g.TargetAmount <= 0
            ? 0
            : Math.Min(100m, Math.Round(g.CurrentAmount / g.TargetAmount * 100m, 2));

        return new SavingsGoalResponse
        {
            Id = g.Id,
            Name = g.Name,
            TargetAmount = g.TargetAmount,
            CurrentAmount = g.CurrentAmount,
            ProgressPercent = progress,
            CreatedAt = g.CreatedAt,
            UpdatedAt = g.UpdatedAt
        };
    }
}
