using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Goals;

public class DepositSavingsGoalRequest
{
    [Range(0.01, double.MaxValue)]
    public decimal Amount { get; set; }
}
