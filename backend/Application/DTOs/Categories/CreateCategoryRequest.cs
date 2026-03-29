using Domain.Enums;

namespace Application.DTOs.Categories;

public class CreateCategoryRequest
{
    public string Name { get; set; } = null!;
    public TransactionType Type { get; set; }
}
