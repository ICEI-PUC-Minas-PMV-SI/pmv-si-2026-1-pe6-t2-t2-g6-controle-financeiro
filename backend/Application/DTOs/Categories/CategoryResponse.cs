using Domain.Enums;

namespace Application.DTOs.Categories;

public class CategoryResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public TransactionType Type { get; set; }

}
