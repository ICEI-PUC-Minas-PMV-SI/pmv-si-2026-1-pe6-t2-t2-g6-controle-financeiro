namespace Application.Interfaces.Security;

public interface IJwtTokenService
{
    string GenerateAccessToken(Guid userId, string email, string userName, string firstName, string lastName, IList<string> roles);
    string GenerateRefreshToken();
    DateTime GetAccessTokenExpiration();
}
