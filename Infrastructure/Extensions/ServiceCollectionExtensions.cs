using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MultitenancyDemo.Core.Interfaces;
using MultitenancyDemo.Core.Settings;
using MultitenancyDemo.Infrastructure.Persistence;

namespace MultitenancyDemo.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddAndMigrateTenantDatabases(
        this IServiceCollection services, IConfiguration config)
    {
        var settings = services.GetOptions<TenantSettings>(nameof(TenantSettings));
        var defaultConnStr = settings.Defaults.ConnectionString;
        var provider = settings.Defaults.DBProvider.ToLower();

        if (provider == "mssql")
        {
            services.AddDbContext<ApplicationDbContext>((serviceProvider, opts) =>
            {
                var tenantService = serviceProvider.GetRequiredService<ITenantService>();
                var connStr = tenantService.GetConnectionString();
                opts.UseSqlServer(connStr,
                    o => o.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName));
            });
        }

        // Run migrations per tenant — sans passer par TenantService
        foreach (var tenant in settings.Tenants)
        {
            var connStr = string.IsNullOrEmpty(tenant.ConnectionString)
                ? defaultConnStr
                : tenant.ConnectionString;

            // Crée un DbContext directement, sans ITenantService
            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
            optionsBuilder.UseSqlServer(connStr,
                o => o.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName));

            using var db = new ApplicationDbContext(optionsBuilder.Options);
            if (db.Database.GetMigrations().Any())
                db.Database.Migrate();
        }

        return services;
    }

    public static T GetOptions<T>(this IServiceCollection services, string sectionName) where T : new()
    {
        using var sp = services.BuildServiceProvider();
        var config = sp.GetRequiredService<IConfiguration>();
        var section = config.GetSection(sectionName);
        var options = new T();
        section.Bind(options);
        return options;
    }
}