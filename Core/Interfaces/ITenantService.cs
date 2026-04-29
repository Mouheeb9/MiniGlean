using MultitenancyDemo.Core.Entities;

namespace MultitenancyDemo.Core.Interfaces;

public interface ITenantService
{
    string GetConnectionString();
    Tenant GetTenant();
}