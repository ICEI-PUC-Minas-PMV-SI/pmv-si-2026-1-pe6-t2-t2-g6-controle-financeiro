namespace Application.Interfaces.Security;

public interface IJwtTokenService
{
    string GeneratorAccessToken(Guid userId, string email, string userName, string firstName, string lastName, IList<string> roles);
    string GeneratorRefreshToken();
    DateTime GetAccessTokenExpiration();
}
