using MultitenancyDemo.Core.Settings;

namespace MultitenancyDemo.Core.Interfaces;

public interface ITenantService
{
    string GetDatabaseProvider();
    string GetConnectionString();
    Tenant GetTenant();
}