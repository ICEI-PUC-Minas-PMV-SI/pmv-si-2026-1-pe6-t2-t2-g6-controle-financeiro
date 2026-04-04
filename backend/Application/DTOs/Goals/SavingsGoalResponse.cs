namespace Application.DTOs.Goals;

public class SavingsGoalResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public decimal TargetAmount { get; set; }
    public decimal CurrentAmount { get; set; }
    public decimal ProgressPercent { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
