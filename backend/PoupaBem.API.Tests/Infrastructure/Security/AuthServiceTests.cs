using Application.DTOs;
using Application.Interfaces.Security;
using Infrastructure.Identity;
using Infrastructure.Security;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;

namespace PoupaBem.API.Tests.Infrastructure.Security;

public class AuthServiceTests
{
    [Fact]
    public async Task LoginAsync_ShouldThrow_WhenUserIsNotFound()
    {
        var userManagerMock = CreateUserManagerMock();
        var jwtTokenServiceMock = new Mock<IJwtTokenService>();
        var sut = CreateSut(userManagerMock.Object, jwtTokenServiceMock.Object);

        userManagerMock
            .Setup(x => x.FindByEmailAsync("missing@local"))
            .ReturnsAsync((ApplicationUser?)null);

        var request = new LoginRequest
        {
            Email = "missing@local",
            Password = "123456"
        };

        var ex = await Assert.ThrowsAsync<ApplicationException>(() => sut.LoginAsync(request, CancellationToken.None));

        Assert.Equal("Credenciais inválidas", ex.Message);
        userManagerMock.Verify(x => x.CheckPasswordAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>()), Times.Never);
    }

    [Fact]
    public async Task LoginAsync_ShouldThrow_WhenUserIsInactive()
    {
        var userManagerMock = CreateUserManagerMock();
        var jwtTokenServiceMock = new Mock<IJwtTokenService>();
        var sut = CreateSut(userManagerMock.Object, jwtTokenServiceMock.Object);

        var user = new ApplicationUser
        {
            Id = Guid.NewGuid(),
            Email = "user@local",
            UserName = "user@local",
            FirstName = "User",
            LastName = "Local",
            IsActive = false
        };

        userManagerMock
            .Setup(x => x.FindByEmailAsync("user@local"))
            .ReturnsAsync(user);

        var request = new LoginRequest
        {
            Email = "user@local",
            Password = "123456"
        };

        var ex = await Assert.ThrowsAsync<ApplicationException>(() => sut.LoginAsync(request, CancellationToken.None));

        Assert.Equal("Usuário inativo", ex.Message);
        userManagerMock.Verify(x => x.CheckPasswordAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>()), Times.Never);
    }

    [Fact]
    public async Task LoginAsync_ShouldThrow_WhenPasswordIsInvalid()
    {
        var userManagerMock = CreateUserManagerMock();
        var jwtTokenServiceMock = new Mock<IJwtTokenService>();
        var sut = CreateSut(userManagerMock.Object, jwtTokenServiceMock.Object);

        var user = new ApplicationUser
        {
            Id = Guid.NewGuid(),
            Email = "user@local",
            UserName = "user@local",
            FirstName = "User",
            LastName = "Local",
            IsActive = true
        };

        userManagerMock.Setup(x => x.FindByEmailAsync("user@local")).ReturnsAsync(user);
        userManagerMock.Setup(x => x.CheckPasswordAsync(user, "senha-invalida")).ReturnsAsync(false);

        var request = new LoginRequest
        {
            Email = "user@local",
            Password = "senha-invalida"
        };

        var ex = await Assert.ThrowsAsync<ApplicationException>(() => sut.LoginAsync(request, CancellationToken.None));

        Assert.Equal("Credenciais inválidas", ex.Message);
    }

    [Fact]
    public async Task LoginAsync_ShouldReturnAuthResponseAndUpdateUser_WhenCredentialsAreValid()
    {
        var userManagerMock = CreateUserManagerMock();
        var jwtTokenServiceMock = new Mock<IJwtTokenService>();
        var sut = CreateSut(userManagerMock.Object, jwtTokenServiceMock.Object);

        var userId = Guid.NewGuid();
        var user = new ApplicationUser
        {
            Id = userId,
            Email = "user@local",
            UserName = "user@local",
            FirstName = "User",
            LastName = "Local",
            IsActive = true
        };

        userManagerMock.Setup(x => x.FindByEmailAsync("user@local")).ReturnsAsync(user);
        userManagerMock.Setup(x => x.CheckPasswordAsync(user, "senha-ok")).ReturnsAsync(true);
        userManagerMock.Setup(x => x.GetRolesAsync(user)).ReturnsAsync(new List<string> { "User" });
        userManagerMock.Setup(x => x.UpdateAsync(user)).ReturnsAsync(IdentityResult.Success);

        var expiresAt = DateTime.UtcNow.AddMinutes(30);

        jwtTokenServiceMock
            .Setup(x => x.GenerateAccessToken(
                userId,
                "user@local",
                "user@local",
                "User",
                "Local",
                It.IsAny<IList<string>>()))
            .Returns("token-access");

        jwtTokenServiceMock.Setup(x => x.GenerateRefreshToken()).Returns("token-refresh");
        jwtTokenServiceMock.Setup(x => x.GetAccessTokenExpiration()).Returns(expiresAt);

        var request = new LoginRequest
        {
            Email = "user@local",
            Password = "senha-ok"
        };

        var response = await sut.LoginAsync(request, CancellationToken.None);

        Assert.Equal("token-access", response.AccessToken);
        Assert.Equal("token-refresh", response.RefreshToken);
        Assert.Equal(userId.ToString(), response.UserId);
        Assert.Equal("user@local", response.Email);
        Assert.Equal("User Local", response.FullName);
        Assert.Equal(expiresAt, response.ExpiresAt);

        Assert.Equal("token-refresh", user.RefreshToken);
        Assert.NotNull(user.RefreshTokenExpiresAt);
        userManagerMock.Verify(x => x.UpdateAsync(user), Times.Once);
    }

    [Fact]
    public async Task RegisterAsync_ShouldThrow_WhenPasswordConfirmationDoesNotMatch()
    {
        var userManagerMock = CreateUserManagerMock();
        var jwtTokenServiceMock = new Mock<IJwtTokenService>();
        var sut = CreateSut(userManagerMock.Object, jwtTokenServiceMock.Object);

        var request = new RegisterUserRequest
        {
            FirstName = "Test",
            LastName = "User",
            Email = "user@local",
            Password = "123",
            ConfirmPassword = "456"
        };

        var ex = await Assert.ThrowsAsync<ApplicationException>(() => sut.RegisterAsync(request, CancellationToken.None));

        Assert.Equal("As senhas não conferem", ex.Message);
        userManagerMock.Verify(x => x.FindByEmailAsync(It.IsAny<string>()), Times.Never);
    }

    [Fact]
    public async Task RegisterAsync_ShouldThrow_WhenEmailAlreadyExists()
    {
        var userManagerMock = CreateUserManagerMock();
        var jwtTokenServiceMock = new Mock<IJwtTokenService>();
        var sut = CreateSut(userManagerMock.Object, jwtTokenServiceMock.Object);

        var existing = new ApplicationUser
        {
            Id = Guid.NewGuid(),
            Email = "user@local",
            UserName = "user@local",
            FirstName = "Existing",
            LastName = "User",
            IsActive = true
        };

        userManagerMock
            .Setup(x => x.FindByEmailAsync("user@local"))
            .ReturnsAsync(existing);

        var request = new RegisterUserRequest
        {
            FirstName = "New",
            LastName = "User",
            Email = "user@local",
            Password = "123456",
            ConfirmPassword = "123456"
        };

        var ex = await Assert.ThrowsAsync<ApplicationException>(() => sut.RegisterAsync(request, CancellationToken.None));

        Assert.Equal("Email já cadastrado", ex.Message);
        userManagerMock.Verify(x => x.CreateAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>()), Times.Never);
    }

    [Fact]
    public async Task RegisterAsync_ShouldThrow_WhenCreateUserFails()
    {
        var userManagerMock = CreateUserManagerMock();
        var jwtTokenServiceMock = new Mock<IJwtTokenService>();
        var sut = CreateSut(userManagerMock.Object, jwtTokenServiceMock.Object);

        userManagerMock
            .Setup(x => x.FindByEmailAsync("new@local"))
            .ReturnsAsync((ApplicationUser?)null);

        userManagerMock
            .Setup(x => x.CreateAsync(It.IsAny<ApplicationUser>(), "123456"))
            .ReturnsAsync(IdentityResult.Failed(new IdentityError { Description = "Senha fraca" }));

        var request = new RegisterUserRequest
        {
            FirstName = "New",
            LastName = "User",
            Email = "new@local",
            Password = "123456",
            ConfirmPassword = "123456"
        };

        var ex = await Assert.ThrowsAsync<ApplicationException>(() => sut.RegisterAsync(request, CancellationToken.None));

        Assert.Equal("Senha fraca", ex.Message);
        userManagerMock.Verify(x => x.AddToRoleAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>()), Times.Never);
    }

    [Fact]
    public async Task RegisterAsync_ShouldReturnAuthResponse_WhenRequestIsValid()
    {
        var userManagerMock = CreateUserManagerMock();
        var jwtTokenServiceMock = new Mock<IJwtTokenService>();
        var sut = CreateSut(userManagerMock.Object, jwtTokenServiceMock.Object);

        userManagerMock
            .Setup(x => x.FindByEmailAsync("new@local"))
            .ReturnsAsync((ApplicationUser?)null);

        userManagerMock
            .Setup(x => x.CreateAsync(It.IsAny<ApplicationUser>(), "123456"))
            .ReturnsAsync(IdentityResult.Success);

        userManagerMock
            .Setup(x => x.AddToRoleAsync(It.IsAny<ApplicationUser>(), "User"))
            .ReturnsAsync(IdentityResult.Success);

        userManagerMock
            .Setup(x => x.GetRolesAsync(It.IsAny<ApplicationUser>()))
            .ReturnsAsync(new List<string> { "User" });

        userManagerMock
            .Setup(x => x.UpdateAsync(It.IsAny<ApplicationUser>()))
            .ReturnsAsync(IdentityResult.Success);

        var expiresAt = DateTime.UtcNow.AddMinutes(30);

        jwtTokenServiceMock
            .Setup(x => x.GenerateAccessToken(
                It.IsAny<Guid>(),
                "new@local",
                "new@local",
                "New",
                "User",
                It.IsAny<IList<string>>()))
            .Returns("token-access");

        jwtTokenServiceMock.Setup(x => x.GenerateRefreshToken()).Returns("token-refresh");
        jwtTokenServiceMock.Setup(x => x.GetAccessTokenExpiration()).Returns(expiresAt);

        var request = new RegisterUserRequest
        {
            FirstName = "New",
            LastName = "User",
            Email = "new@local",
            Password = "123456",
            ConfirmPassword = "123456"
        };

        var response = await sut.RegisterAsync(request, CancellationToken.None);

        Assert.Equal("token-access", response.AccessToken);
        Assert.Equal("token-refresh", response.RefreshToken);
        Assert.Equal("new@local", response.Email);
        Assert.Equal("New User", response.FullName);
        Assert.Equal(expiresAt, response.ExpiresAt);

        userManagerMock.Verify(x => x.AddToRoleAsync(It.IsAny<ApplicationUser>(), "User"), Times.Once);
        userManagerMock.Verify(x => x.UpdateAsync(It.IsAny<ApplicationUser>()), Times.Once);
    }

    [Fact]
    public async Task RefreshTokenAsync_ShouldThrow_WhenRefreshTokenIsNotInformed()
    {
        var userManagerMock = CreateUserManagerMock();
        var jwtTokenServiceMock = new Mock<IJwtTokenService>();
        var sut = CreateSut(userManagerMock.Object, jwtTokenServiceMock.Object);

        var request = new RefreshTokenRequest
        {
            RefreshToken = string.Empty
        };

        var ex = await Assert.ThrowsAsync<ApplicationException>(() => sut.RefreshTokenAsync(request, CancellationToken.None));

        Assert.Equal("Refresh token não informado.", ex.Message);
    }

    private static AuthService CreateSut(UserManager<ApplicationUser> userManager, IJwtTokenService jwtTokenService)
    {
        var options = Options.Create(new JwtOptions
        {
            RefreshTokenExpirationDays = 7,
            AccessTokenExpirationMinutes = 30,
            Audience = "aud",
            Issuer = "iss",
            SecretKey = "12345678901234567890123456789012"
        });

        return new AuthService(userManager, jwtTokenService, options);
    }

    private static Mock<UserManager<ApplicationUser>> CreateUserManagerMock()
    {
        var store = new Mock<IUserStore<ApplicationUser>>();

        return new Mock<UserManager<ApplicationUser>>(
            store.Object,
            Options.Create(new IdentityOptions()),
            new Mock<IPasswordHasher<ApplicationUser>>().Object,
            new List<IUserValidator<ApplicationUser>>(),
            new List<IPasswordValidator<ApplicationUser>>(),
            new Mock<ILookupNormalizer>().Object,
            new IdentityErrorDescriber(),
            new Mock<IServiceProvider>().Object,
            new Mock<ILogger<UserManager<ApplicationUser>>>().Object);
    }
}
