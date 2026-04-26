using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using MultitenancyDemo.Core.Interfaces;
using MultitenancyDemo.Core.Settings;

namespace MultitenancyDemo.Infrastructure.Services;

public class TenantService : ITenantService
{
    private readonly TenantSettings _tenantSettings;
    private Tenant _currentTenant = default!;

    public TenantService(IOptions<TenantSettings> tenantSettings, IHttpContextAccessor httpContextAccessor)
    {
        _tenantSettings = tenantSettings.Value;

        var httpContext = httpContextAccessor.HttpContext;
        if (httpContext is null) return;

        if (!httpContext.Request.Headers.TryGetValue("tenant", out var tenantId))
            throw new Exception("Invalid Tenant! No tenant header found.");

        SetTenant(tenantId.ToString());
    }

    private void SetTenant(string tenantId)
    {
        _currentTenant = _tenantSettings.Tenants
            .FirstOrDefault(t => t.TID == tenantId)
            ?? throw new Exception($"Invalid Tenant! Tenant '{tenantId}' not found.");

        // If no dedicated connection string → use shared default
        if (string.IsNullOrEmpty(_currentTenant.ConnectionString))
            _currentTenant.ConnectionString = _tenantSettings.Defaults.ConnectionString;
    }

    public string GetConnectionString() => _currentTenant?.ConnectionString!;
    public string GetDatabaseProvider() => _tenantSettings.Defaults.DBProvider;
    public Tenant GetTenant() => _currentTenant;
}