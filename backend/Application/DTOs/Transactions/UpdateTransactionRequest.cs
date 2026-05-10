using Domain.Enums;
using Application.DTOs.Validation;
using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Transactions;

public class UpdateTransactionRequest
{
    [Required]
    [MinLength(2)]
    [MaxLength(150)]
    public string Title { get; set; } = null!;

    [MaxLength(500)]
    public string? Description { get; set; }

    [Range(0.01, double.MaxValue)]
    public decimal Amount { get; set; }

    [EnumDataType(typeof(TransactionType))]
    public TransactionType TransactionType { get; set; }

    [NotEmptyGuid]
    public Guid CategoryId { get; set; }

    [Required]
    public DateTime OcurredAt { get; set; }
}
