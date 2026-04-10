using Infrastructure.Persistence;
using Infrastructure.Security;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;

namespace PoupaBem.API.Tests.Integration;

public sealed class IntegrationTestWebAppFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private const string JwtIssuer = "PoupaBem.Tests";
    private const string JwtAudience = "PoupaBem.Tests.Clients";
    private const string JwtSecretKey = "11111111-1111-1111-1111-111111111111";
    private const string DefaultTestDatabaseName = "PoupaBem_test";

    private readonly string _host;
    private readonly string _port;
    private readonly string _databaseName;
    private readonly string _username;
    private readonly string _password;
    private readonly string _connectionString;
    private readonly string _maintenanceConnectionString;
    private bool _serverStarted;

    public IntegrationTestWebAppFactory()
    {
        _host = Environment.GetEnvironmentVariable("POUPABEM_TEST_DB_HOST") ?? "localhost";
        _port = Environment.GetEnvironmentVariable("POUPABEM_TEST_DB_PORT") ?? "5432";
        _databaseName = Environment.GetEnvironmentVariable("POUPABEM_TEST_DB_NAME") ?? DefaultTestDatabaseName;
        _username = Environment.GetEnvironmentVariable("POUPABEM_TEST_DB_USER") ?? "postgres";
        _password = Environment.GetEnvironmentVariable("POUPABEM_TEST_DB_PASSWORD") ?? "123";

        _connectionString = BuildConnectionString(_databaseName);
        _maintenanceConnectionString = BuildConnectionString("postgres");

        ApplyEnvironmentOverrides();
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");

        builder.ConfigureAppConfiguration((_, configBuilder) =>
        {
            configBuilder.AddInMemoryCollection(BuildConfigurationOverrides());
        });
    }

    public HttpClient CreateApiClient()
    {
        return CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false
        });
    }

    public async Task InitializeAsync()
    {
        await EnsureDatabaseExistsAsync();

        _ = Server;
        _serverStarted = true;

        await using var scope = Services.CreateAsyncScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        await dbContext.Database.MigrateAsync();
        await ResetStateAsync();
    }

    async Task IAsyncLifetime.DisposeAsync()
    {
        try
        {
            if (_serverStarted)
            {
                await ResetStateAsync();
            }
        }
        finally
        {
            ClearEnvironmentOverrides();
            Dispose();
        }
    }

    public async Task ResetStateAsync()
    {
        await using var scope = Services.CreateAsyncScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        await dbContext.Database.ExecuteSqlRawAsync(
            """
            TRUNCATE TABLE
                transactions,
                categories,
                savings_goals,
                "AspNetUserTokens",
                "AspNetUserLogins",
                "AspNetUserClaims",
                "AspNetUserRoles",
                "AspNetRoleClaims",
                "AspNetUsers",
                "AspNetRoles"
            RESTART IDENTITY CASCADE;
            """);

        await IdentitySeed.SeedRolesAsync(scope.ServiceProvider);
    }

    private string BuildConnectionString(string databaseName)
    {
        return $"Host={_host};Port={_port};Database={databaseName};Username={_username};Password={_password}";
    }

    private Dictionary<string, string?> BuildConfigurationOverrides()
    {
        return new Dictionary<string, string?>
        {
            ["ConnectionStrings:DefaultConnection"] = _connectionString,
            ["Jwt:Issuer"] = JwtIssuer,
            ["Jwt:Audience"] = JwtAudience,
            ["Jwt:SecretKey"] = JwtSecretKey,
            ["Jwt:AccessTokenExpirationMinutes"] = "60",
            ["Jwt:RefreshTokenExpirationDays"] = "7"
        };
    }

    private void ApplyEnvironmentOverrides()
    {
        Environment.SetEnvironmentVariable("ConnectionStrings__DefaultConnection", _connectionString);
        Environment.SetEnvironmentVariable("Jwt__Issuer", JwtIssuer);
        Environment.SetEnvironmentVariable("Jwt__Audience", JwtAudience);
        Environment.SetEnvironmentVariable("Jwt__SecretKey", JwtSecretKey);
        Environment.SetEnvironmentVariable("Jwt__AccessTokenExpirationMinutes", "60");
        Environment.SetEnvironmentVariable("Jwt__RefreshTokenExpirationDays", "7");
    }

    private async Task EnsureDatabaseExistsAsync()
    {
        await using var connection = new NpgsqlConnection(_maintenanceConnectionString);
        await connection.OpenAsync();

        await using var existsCommand = new NpgsqlCommand(
            "SELECT 1 FROM pg_database WHERE datname = @databaseName;",
            connection);
        existsCommand.Parameters.AddWithValue("databaseName", _databaseName);

        var exists = await existsCommand.ExecuteScalarAsync();
        if (exists is not null)
            return;

        var escapedDatabaseName = _databaseName.Replace("\"", "\"\"", StringComparison.Ordinal);

        await using var createCommand = new NpgsqlCommand(
            $"CREATE DATABASE \"{escapedDatabaseName}\";",
            connection);
        await createCommand.ExecuteNonQueryAsync();
    }

    private static void ClearEnvironmentOverrides()
    {
        Environment.SetEnvironmentVariable("ConnectionStrings__DefaultConnection", null);
        Environment.SetEnvironmentVariable("Jwt__Issuer", null);
        Environment.SetEnvironmentVariable("Jwt__Audience", null);
        Environment.SetEnvironmentVariable("Jwt__SecretKey", null);
        Environment.SetEnvironmentVariable("Jwt__AccessTokenExpirationMinutes", null);
        Environment.SetEnvironmentVariable("Jwt__RefreshTokenExpirationDays", null);
    }
}
