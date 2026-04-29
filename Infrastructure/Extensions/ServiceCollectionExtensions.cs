using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MultitenancyDemo.Core.Interfaces;
using MultitenancyDemo.Infrastructure.Persistence;

namespace MultitenancyDemo.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddAndMigrateTenantDatabases(
        this IServiceCollection services, IConfiguration config)
    {
        // Build a temporary service provider to access UserDbContext
        var sp = services.BuildServiceProvider();
        var userDbContext = sp.GetRequiredService<UserDbContext>();
        var defaultConnStr = config.GetConnectionString("OurUsers")!;

        // Register ApplicationDbContext with dynamic tenant connection
        services.AddDbContext<ApplicationDbContext>((serviceProvider, opts) =>
        {
            var tenantService = serviceProvider.GetRequiredService<ITenantService>();
            var connStr = tenantService.GetConnectionString();
            opts.UseSqlServer(connStr,
                o => o.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName));
        });

        // Fetch tenants from database and run migrations
        var tenants = userDbContext.Tenants.ToList();

        foreach (var tenant in tenants)
        {
            var connStr = string.IsNullOrEmpty(tenant.ConnectionString)
                ? defaultConnStr
                : tenant.ConnectionString;

            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
            optionsBuilder.UseSqlServer(connStr,
                o => o.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName));

            using var db = new ApplicationDbContext(optionsBuilder.Options);
            if (db.Database.GetMigrations().Any())
                db.Database.Migrate();
        }

        sp.Dispose();
        return services;
    }
}
