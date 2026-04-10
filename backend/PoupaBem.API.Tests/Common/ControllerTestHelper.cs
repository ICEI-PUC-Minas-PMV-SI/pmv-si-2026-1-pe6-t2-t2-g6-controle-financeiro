using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace PoupaBem.API.Tests.Common;

internal static class ControllerTestHelper
{
    public static void SetUser(ControllerBase controller, Guid? userId)
    {
        var claims = new List<Claim>();

        if (userId.HasValue)
            claims.Add(new Claim("sub", userId.Value.ToString()));

        var identity = new ClaimsIdentity(claims, "TestAuth");
        var principal = new ClaimsPrincipal(identity);

        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = principal }
        };
    }
}
