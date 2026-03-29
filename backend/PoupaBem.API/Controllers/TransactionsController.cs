using Application.DTOs.Categories;
using Application.DTOs.Transactions;
using Application.Interfaces.Repositories;
using Domain.Entites;
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

        var category = await categoryRepository.GetByIdAsync(request.CategoryId, cancellationToken) ?? throw new ApplicationException("Categoria não encontrada");

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

        return Ok(new TransactionResponse
        {
            Id = transaction.Id,
            Title = transaction.Title,
            Description = transaction.Description,
            Amount = transaction.Amount,
            TransactionType = transaction.TransactionType,
            CategoryId = transaction.CategoryId,
            OcurredAt = transaction.OcurredAt
        });
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromServices] ITransactionRepository transactionRepository,
        CancellationToken cancellationToken)
    {
        var userIdValue = User.FindFirst("sub")?.Value;

        if (!Guid.TryParse(userIdValue, out var userId))
            return Unauthorized();

        var transactions = await transactionRepository.GetByUserAsync(userId, cancellationToken);

        var response = transactions.Select(x => new TransactionResponse
        {
            Id = x.Id,
            Title = x.Title,
            Description = x.Description,
            Amount = x.Amount,
            TransactionType = x.TransactionType,
            CategoryId = x.CategoryId,
            OcurredAt = x.OcurredAt
        });

        return Ok(response);
    }
}
