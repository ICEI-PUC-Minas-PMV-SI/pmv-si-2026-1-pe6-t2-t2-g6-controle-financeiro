using Domain.Enums;

namespace Application.DTOs.Categories;

public class UpdateCategoryRequest
{
    public string Name { get; set; } = null!;
    public TransactionType Type { get; set; }
}
