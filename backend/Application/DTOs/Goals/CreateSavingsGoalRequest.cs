namespace Application.DTOs.Goals;

public class CreateSavingsGoalRequest
{
    public string Name { get; set; } = null!;
    public decimal TargetAmount { get; set; }
}
