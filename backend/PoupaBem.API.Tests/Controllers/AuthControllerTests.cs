using Application.DTOs;
using Application.Interfaces.Security;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using PoupaBem.API.Controllers;
using System.Security.Claims;
using System.Text.Json;

namespace PoupaBem.API.Tests.Controllers;

public class AuthControllerTests
{
    [Fact]
    public async Task Login_ShouldReturnOkWithAuthResponse()
    {
        var controller = new AuthController();
        var authServiceMock = new Mock<IAuthService>();

        var expected = new AuthResponse
        {
            AccessToken = "access",
            RefreshToken = "refresh",
            UserId = Guid.NewGuid().ToString(),
            Email = "user@local",
            FullName = "User Local",
            ExpiresAt = DateTime.UtcNow.AddMinutes(30)
        };

        authServiceMock
            .Setup(x => x.LoginAsync(It.IsAny<LoginRequest>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(expected);

        var request = new LoginRequest
        {
            Email = "user@local",
            Password = "senha"
        };

        var result = await controller.Login(authServiceMock.Object, request, CancellationToken.None);

        var ok = Assert.IsType<OkObjectResult>(result);
        var payload = Assert.IsType<AuthResponse>(ok.Value);

        Assert.Equal(expected.AccessToken, payload.AccessToken);
        Assert.Equal(expected.RefreshToken, payload.RefreshToken);
        Assert.Equal(expected.UserId, payload.UserId);
    }

    [Fact]
    public async Task Register_ShouldReturnOkWithAuthResponse()
    {
        var controller = new AuthController();
        var authServiceMock = new Mock<IAuthService>();

        var expected = new AuthResponse
        {
            AccessToken = "access-register",
            RefreshToken = "refresh-register",
            UserId = Guid.NewGuid().ToString(),
            Email = "register@local",
            FullName = "Register User",
            ExpiresAt = DateTime.UtcNow.AddMinutes(30)
        };

        authServiceMock
            .Setup(x => x.RegisterAsync(It.IsAny<RegisterUserRequest>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(expected);

        var request = new RegisterUserRequest
        {
            FirstName = "Register",
            LastName = "User",
            Email = "register@local",
            Password = "senha-forte",
            ConfirmPassword = "senha-forte"
        };

        var result = await controller.Register(authServiceMock.Object, request, CancellationToken.None);

        var ok = Assert.IsType<OkObjectResult>(result);
        var payload = Assert.IsType<AuthResponse>(ok.Value);

        Assert.Equal(expected.AccessToken, payload.AccessToken);
        Assert.Equal(expected.RefreshToken, payload.RefreshToken);
        Assert.Equal(expected.UserId, payload.UserId);
    }

    [Fact]
    public async Task Refresh_ShouldReturnOkWithAuthResponse()
    {
        var controller = new AuthController();
        var authServiceMock = new Mock<IAuthService>();

        var expected = new AuthResponse
        {
            AccessToken = "access-refresh",
            RefreshToken = "refresh-new",
            UserId = Guid.NewGuid().ToString(),
            Email = "refresh@local",
            FullName = "Refresh User",
            ExpiresAt = DateTime.UtcNow.AddMinutes(30)
        };

        authServiceMock
            .Setup(x => x.RefreshTokenAsync(It.IsAny<RefreshTokenRequest>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(expected);

        var request = new RefreshTokenRequest
        {
            RefreshToken = "refresh-old"
        };

        var result = await controller.Refresh(authServiceMock.Object, request, CancellationToken.None);

        var ok = Assert.IsType<OkObjectResult>(result);
        var payload = Assert.IsType<AuthResponse>(ok.Value);

        Assert.Equal(expected.AccessToken, payload.AccessToken);
        Assert.Equal(expected.RefreshToken, payload.RefreshToken);
        Assert.Equal(expected.UserId, payload.UserId);
    }

    [Fact]
    public void Me_ShouldReturnOkWithProjectedClaims()
    {
        var controller = new AuthController();
        var userId = Guid.NewGuid();

        var claims = new List<Claim>
        {
            new("sub", userId.ToString()),
            new("email", "user@local"),
            new("unique_name", "user.local")
        };

        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext
            {
                User = new ClaimsPrincipal(new ClaimsIdentity(claims, "TestAuth"))
            }
        };

        var result = controller.Me();

        var ok = Assert.IsType<OkObjectResult>(result);
        var json = JsonSerializer.Serialize(ok.Value);

        Assert.Contains($"\"userId\":\"{userId}\"", json, StringComparison.Ordinal);
        Assert.Contains("\"email\":\"user@local\"", json, StringComparison.Ordinal);
        Assert.Contains("\"userName\":\"user.local\"", json, StringComparison.Ordinal);
        Assert.Contains("\"Type\":\"sub\"", json, StringComparison.Ordinal);
    }
}
