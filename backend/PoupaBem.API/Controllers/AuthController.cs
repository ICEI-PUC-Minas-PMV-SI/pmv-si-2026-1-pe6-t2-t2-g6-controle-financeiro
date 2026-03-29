using Application.DTOs;
using Application.Interfaces.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace PoupaBem.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register(
        [FromServices] IAuthService authService,
        [FromBody] RegisterUserRequest request,
        CancellationToken cancellationToken)
    {
        var response = await authService.RegisterAsync(request, cancellationToken);
        return Ok(response);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(
        [FromServices] IAuthService authService,
        [FromBody] LoginRequest request,
        CancellationToken cancellationToken)
    {
        var response = await authService.LoginAsync(request, cancellationToken);
        return Ok(response);
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh(
        [FromServices] IAuthService authService,
        [FromBody] RefreshTokenRequest request,
        CancellationToken cancellationToken)
    {
        var response = await authService.RefreshTokenAsync(request, cancellationToken);
        return Ok(response);
    }

    [Authorize]
    [HttpGet("me")]
    public IActionResult Me()
    {
        return Ok(new
        {
            userId = User.FindFirst("sub")?.Value,
            email = User.FindFirst("email")?.Value,
            userName = User.FindFirst("unique_name")?.Value,

            claims = User.Claims.Select(x => new
            {
                x.Type,
                x.Value,
            })
        });
    }
}
