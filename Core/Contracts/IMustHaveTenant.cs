namespace MultitenancyDemo.Core.Contracts;

public interface IMustHaveTenant
{
    string TenantId { get; set; }
}