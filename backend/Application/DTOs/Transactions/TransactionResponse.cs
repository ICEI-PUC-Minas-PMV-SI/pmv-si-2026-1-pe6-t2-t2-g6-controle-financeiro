using Domain.Enums;

namespace Application.DTOs.Transactions;

public class TransactionResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public decimal Amount { get; set; }
    public TransactionType TransactionType { get; set; }
    public Guid CategoryId { get; set; }
    public DateTime OcurredAt { get; set; }
}
