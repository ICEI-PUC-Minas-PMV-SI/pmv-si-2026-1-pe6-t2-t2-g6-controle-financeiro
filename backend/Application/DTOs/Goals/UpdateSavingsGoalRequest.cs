using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Goals;

public class UpdateSavingsGoalRequest
{
    [Required]
    [MinLength(2)]
    [MaxLength(120)]
    public string Name { get; set; } = null!;

    [Range(0.01, double.MaxValue)]
    public decimal TargetAmount { get; set; }
}
