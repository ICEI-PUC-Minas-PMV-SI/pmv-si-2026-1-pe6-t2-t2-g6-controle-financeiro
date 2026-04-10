using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace PoupaBem.API.Tests.Common;

internal static class DbContextTestFactory
{
    public static ApplicationDbContext Create(string? databaseName = null)
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName ?? Guid.NewGuid().ToString("N"))
            .Options;

        return new ApplicationDbContext(options);
    }
}
