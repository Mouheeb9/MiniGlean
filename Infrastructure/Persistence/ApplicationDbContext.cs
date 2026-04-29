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

    public DbSet<Document> Documents => Set<Document>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Query filter for multi-tenancy
        modelBuilder.Entity<Document>()
            .HasQueryFilter(d => d.TenantId == TenantId);

        // Note: No foreign key constraint because Users are in a different database (OurUsers)
        // The UserId is maintained as a data-only reference (GUID)
        // If a user is deleted, documents will orphan (which is acceptable for audit trail)
        modelBuilder.Entity<Document>()
            .Property(d => d.UserId)
            .IsRequired();
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