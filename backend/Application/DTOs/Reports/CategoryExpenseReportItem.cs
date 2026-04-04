namespace Application.DTOs.Reports;

public class CategoryExpenseReportItem
{
    public Guid CategoryId { get; set; }
    public string CategoryName { get; set; } = null!;
    public decimal TotalAmount { get; set; }
}
