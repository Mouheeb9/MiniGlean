using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace MultitenancyDemo.Infrastructure.Persistence;

/// <summary>
/// Design-time factory for ApplicationDbContext
/// Used by EF Core tools (migrations, etc.) at design time
/// </summary>
public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
        optionsBuilder.UseSqlServer("Server=localhost;Database=design-time;Trusted_Connection=True;TrustServerCertificate=True;");
        
        // Use the migrations-only constructor (without ITenantService)
        return new ApplicationDbContext(optionsBuilder.Options);
    }
}
