using System.ComponentModel.DataAnnotations;

namespace Application.DTOs;

public class RefreshTokenRequest
{
    [Required]
    [MinLength(10)]
    public string RefreshToken { get; set; } = null!;

}
