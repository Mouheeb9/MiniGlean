using Microsoft.EntityFrameworkCore;
using MultitenancyDemo.Core.Contracts;
using MultitenancyDemo.Core.Entities;
using MultitenancyDemo.Core.Interfaces;

namespace MultitenancyDemo.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext
{
    public string TenantId { get; set; } = string.Empty;
    private readonly ITenantService? _tenantService;

    // ✅ Constructor normal — utilisé pendant les requêtes HTTP (via DI)
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, ITenantService tenantService)
        : base(options)
    {
        _tenantService = tenantService;
        TenantId = _tenantService.GetTenant()?.TID ?? string.Empty;
    }

    // ✅ Constructor migrations-only — utilisé au démarrage pour créer les DBs
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
        _tenantService = null;
    }

    public DbSet<Product> Products => Set<Product>();
    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<Product>()
            .HasQueryFilter(p => p.TenantId == TenantId);
    }

    

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<IMustHaveTenant>().ToList())
        {
            if (entry.State is EntityState.Added or EntityState.Modified)
                entry.Entity.TenantId = TenantId;
        }
        return await base.SaveChangesAsync(cancellationToken);
    }
}