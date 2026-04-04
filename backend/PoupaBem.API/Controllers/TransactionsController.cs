using Application.DTOs.Transactions;
using Application.Interfaces.Repositories;
using Domain.Entites;
using Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace PoupaBem.API.Controllers;

[ApiController]
[Route("api/transactions")]
[Authorize]
public class TransactionsController : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromServices] ITransactionRepository transactionRepository,
        [FromServices] ICategoryRepository categoryRepository,
        [FromBody] CreateTransactionRequest request,
        CancellationToken cancellationToken)
    {
        var userIdValue = User.FindFirst("sub")?.Value;

        if (!Guid.TryParse(userIdValue, out var userId))
            return Unauthorized();

        var category = await categoryRepository.GetByIdForUserAsync(request.CategoryId, userId, cancellationToken)
            ?? throw new ApplicationException("Categoria não encontrada ou sem permissão de uso.");

        if (category.Type != request.TransactionType)
            throw new ApplicationException("O tipo da transação deve ser o mesmo tipo da categoria");

        var transaction = new Transaction(
            request.Title,
            request.Description,
            request.Amount,
            request.TransactionType,
            request.CategoryId,
            userId,
            request.OcurredAt);

        await transactionRepository.AddAsync(transaction, cancellationToken);

        return Ok(ToResponse(transaction));
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromServices] ITransactionRepository transactionRepository,
        [FromQuery] DateTime? fromUtc,
        [FromQuery] DateTime? toUtc,
        [FromQuery] Guid? categoryId,
        [FromQuery] TransactionType? transactionType,
        CancellationToken cancellationToken)
    {
        var userIdValue = User.FindFirst("sub")?.Value;

        if (!Guid.TryParse(userIdValue, out var userId))
            return Unauthorized();

        var transactions = await transactionRepository.GetFilteredAsync(
            userId,
            fromUtc,
            toUtc,
            categoryId,
            transactionType,
            cancellationToken);

        var response = transactions.Select(ToResponse);
        return Ok(response);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        [FromServices] ITransactionRepository transactionRepository,
        [FromServices] ICategoryRepository categoryRepository,
        [FromBody] UpdateTransactionRequest request,
        CancellationToken cancellationToken)
    {
        var userIdValue = User.FindFirst("sub")?.Value;

        if (!Guid.TryParse(userIdValue, out var userId))
            return Unauthorized();

        var transaction = await transactionRepository.GetTrackedByIdForUserAsync(id, userId, cancellationToken)
            ?? throw new ApplicationException("Transação não encontrada.");

        var category = await categoryRepository.GetByIdForUserAsync(request.CategoryId, userId, cancellationToken)
            ?? throw new ApplicationException("Categoria não encontrada ou sem permissão de uso.");

        if (category.Type != request.TransactionType)
            throw new ApplicationException("O tipo da transação deve ser o mesmo tipo da categoria");

        transaction.Update(
            request.Title,
            request.Description,
            request.Amount,
            request.TransactionType,
            request.CategoryId,
            request.OcurredAt);

        await transactionRepository.SaveChangesAsync(cancellationToken);

        return Ok(ToResponse(transaction));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(
        Guid id,
        [FromServices] ITransactionRepository transactionRepository,
        CancellationToken cancellationToken)
    {
        var userIdValue = User.FindFirst("sub")?.Value;

        if (!Guid.TryParse(userIdValue, out var userId))
            return Unauthorized();

        var transaction = await transactionRepository.GetTrackedByIdForUserAsync(id, userId, cancellationToken)
            ?? throw new ApplicationException("Transação não encontrada.");

        await transactionRepository.DeleteAsync(transaction, cancellationToken);

        return NoContent();
    }

    private static TransactionResponse ToResponse(Transaction x) => new()
    {
        Id = x.Id,
        Title = x.Title,
        Description = x.Description,
        Amount = x.Amount,
        TransactionType = x.TransactionType,
        CategoryId = x.CategoryId,
        OcurredAt = x.OcurredAt
    };
}
