namespace Application.DTOs.Reports;

public class FinancialSummaryResponse
{
    public decimal TotalIncome { get; set; }
    public decimal TotalExpense { get; set; }
    public decimal Balance { get; set; }
}
