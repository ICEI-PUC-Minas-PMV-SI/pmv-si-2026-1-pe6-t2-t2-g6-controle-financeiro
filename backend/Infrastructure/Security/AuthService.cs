using Application.DTOs;
using Application.Interfaces.Security;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Infrastructure.Security;

public class AuthService(UserManager<ApplicationUser> userManager, IJwtTokenService jwtTokenService, IOptions<JwtOptions> jwtOptions) : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager = userManager;
    private readonly IJwtTokenService _jwtTokenService = jwtTokenService;
    private readonly JwtOptions _jwtOptions = jwtOptions.Value;

    public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        var user = await _userManager.FindByEmailAsync(request.Email) ?? throw new ApplicationException("Credenciais inválidas");

        if (!user.IsActive)
            throw new ApplicationException("Usuário inativo");

        var passwordValid = await _userManager.CheckPasswordAsync(user, request.Password);

        if (!passwordValid)
            throw new ApplicationException("Credenciais inválidas");

        var roles = await _userManager.GetRolesAsync(user);

        var accessToken = _jwtTokenService.GeneratorAccessToken(
            user.Id,
            user.Email!,
            user.UserName!,
            user.FirstName,
            user.LastName,
            roles
        );

        var refreshToken = _jwtTokenService.GeneratorRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiresAt = DateTime.UtcNow.AddDays(_jwtOptions.RefreshTokenExpirationDays);
        user.UpdatedAt = DateTime.UtcNow;
        
        await _userManager.UpdateAsync(user);

        return new AuthResponse
        {
            AccessToken = accessToken,
            ExpiresAt = _jwtTokenService.GetAccessTokenExpiration(),
            RefreshToken = refreshToken,
            UserId = user.Id.ToString(),
            Email = user.Email!,
            FullName = $"{user.FirstName} {user.LastName}",
        };
    }

    public async Task<AuthResponse> RegisterAsync(RegisterUserRequest request, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        if (request.Password != request.ConfirmPassword)
            throw new ApplicationException("As senhas não conferem");

        var existingUser = await _userManager.FindByEmailAsync(request.Email);

        if (existingUser is not null)
            throw new ApplicationException("Email já cadastrado");

        var user = new ApplicationUser
        {
            Id = Guid.NewGuid(),
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            UserName = request.Email,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            EmailConfirmed = true
        };

        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
            throw new ApplicationException(string.Join(" | ", result.Errors.Select(x => x.Description)));

        await _userManager.AddToRoleAsync(user, "User");

        var roles = await _userManager.GetRolesAsync(user);

        var accessToken = _jwtTokenService.GeneratorAccessToken(
            user.Id,
            user.Email!,
            user.UserName!,
            user.FirstName,
            user.LastName,
            roles
        );

        var refreshToken = _jwtTokenService.GeneratorRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiresAt = DateTime.UtcNow.AddDays( _jwtOptions.RefreshTokenExpirationDays);
        
        await _userManager.UpdateAsync(user);

        return new AuthResponse
        {
            AccessToken = accessToken,
            ExpiresAt = _jwtTokenService.GetAccessTokenExpiration(),
            RefreshToken = refreshToken,
            UserId = user.Id.ToString(),
            Email = user.Email!,
            FullName = $"{user.FirstName} {user.LastName}",
        };
    }

    public async Task<AuthResponse> RefreshTokenAsync(RefreshTokenRequest request, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        if (string.IsNullOrEmpty(request.RefreshToken))
            throw new ApplicationException("Refresh token não informado.");

        var user = await _userManager.Users
            .FirstOrDefaultAsync(x => x.RefreshToken == request.RefreshToken, cancellationToken)
            ?? throw new ApplicationException("Refresh token inválido");

        if (!user.IsActive)
            throw new ApplicationException("Usuário Inátivo");

        if (!user.RefreshTokenExpiresAt.HasValue || user.RefreshTokenExpiresAt.Value <= DateTime.UtcNow)
            throw new ApplicationException("Refresh token expirado");

        user.UpdatedAt = DateTime.UtcNow;
        await _userManager.UpdateAsync(user);

        return await GenerateAuthResponseAsync(user);

    }

    private async Task<AuthResponse> GenerateAuthResponseAsync(ApplicationUser user)
    {
        var roles = await _userManager.GetRolesAsync(user);
        var accessToken = _jwtTokenService.GeneratorAccessToken(
            user.Id,
            user.Email!,
            user.UserName!,
            user.FirstName,
            user.LastName,
            roles
        );

        var refreshToken = _jwtTokenService.GeneratorRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiresAt = DateTime.UtcNow.AddDays( _jwtOptions.RefreshTokenExpirationDays );

        var updateResult = await _userManager.UpdateAsync(user);

        if (!updateResult.Succeeded)
            throw new ApplicationException(string.Join(" | ", updateResult.Errors.Select(x => x.Description)));

        return new AuthResponse
        {
            AccessToken = accessToken,
            ExpiresAt = _jwtTokenService.GetAccessTokenExpiration(),
            RefreshToken = refreshToken,
            UserId = user.Id.ToString(),
            Email = user.Email!,
            FullName = $"{user.FirstName} {user.LastName}",
        };
    }
}
