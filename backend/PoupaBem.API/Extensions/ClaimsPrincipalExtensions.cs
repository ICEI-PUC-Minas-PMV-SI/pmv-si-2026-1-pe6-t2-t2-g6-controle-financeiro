using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace PoupaBem.API.Extensions;

public static class ClaimsPrincipalExtensions
{
    private const string SubjectClaimType = JwtRegisteredClaimNames.Sub;

    public static bool TryGetUserId(this ClaimsPrincipal principal, out Guid userId)
    {
        var userIdValue = principal.FindFirstValue(SubjectClaimType)
            ?? principal.FindFirstValue(ClaimTypes.NameIdentifier);

        return Guid.TryParse(userIdValue, out userId);
    }
}
