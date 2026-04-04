namespace Application.DTOs.Goals;

public class UpdateSavingsGoalRequest
{
    public string Name { get; set; } = null!;
    public decimal TargetAmount { get; set; }
}
