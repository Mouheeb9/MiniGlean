namespace MultitenancyDemo.Core.Settings;

public class TenantSettings
{
    public TenantDefaults Defaults { get; set; } = new();
    public List<Tenant> Tenants { get; set; } = [];
}

public class Tenant
{
    public string Name { get; set; } = default!;
    public string TID { get; set; } = default!;
    public string? ConnectionString { get; set; }   // nullable: blank = use shared DB
}

public class TenantDefaults
{
    public string DBProvider { get; set; } = default!;
    public string ConnectionString { get; set; } = default!;
}