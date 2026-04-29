using Microsoft.AspNetCore.Http;
using MultitenancyDemo.Core.Entities;
using MultitenancyDemo.Core.Interfaces;
using MultitenancyDemo.Infrastructure.Persistence;

namespace MultitenancyDemo.Infrastructure.Services;

public class TenantService : ITenantService
{
    private readonly UserDbContext _userDbContext;
    private readonly string _defaultConnectionString;
    private Tenant _currentTenant = default!;

    public TenantService(UserDbContext userDbContext, IHttpContextAccessor httpContextAccessor, IConfiguration config)
    {
        _userDbContext = userDbContext;
        _defaultConnectionString = config.GetConnectionString("OurUsers")!;

        var httpContext = httpContextAccessor.HttpContext;
        if (httpContext is null) return;

        if (!httpContext.Request.Headers.TryGetValue("tenant", out var tenantId))
            throw new Exception("Invalid Tenant! No tenant header found.");

        SetTenant(tenantId.ToString());
    }

    private void SetTenant(string tenantId)
    {
        _currentTenant = _userDbContext.Tenants
            .FirstOrDefault(t => t.TID == tenantId)
            ?? throw new Exception($"Invalid Tenant! Tenant '{tenantId}' not found.");

        // If no dedicated connection string → use shared default
        if (string.IsNullOrEmpty(_currentTenant.ConnectionString))
            _currentTenant.ConnectionString = _defaultConnectionString;
    }

    public string GetConnectionString() => _currentTenant?.ConnectionString!;
    public Tenant GetTenant() => _currentTenant;
}
