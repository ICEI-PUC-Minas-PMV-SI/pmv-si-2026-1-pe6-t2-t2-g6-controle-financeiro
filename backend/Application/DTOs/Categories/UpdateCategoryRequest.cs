using Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Categories;

public class UpdateCategoryRequest
{
    [Required]
    [MinLength(2)]
    [MaxLength(100)]
    public string Name { get; set; } = null!;

    [EnumDataType(typeof(TransactionType))]
    public TransactionType Type { get; set; }
}
