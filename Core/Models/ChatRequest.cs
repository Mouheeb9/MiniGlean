namespace MultitenancyDemo.Core.Models;

public class ChatRequest
{
    public string Question { get; set; } = string.Empty;
    public string TenantId { get; set; } = "default";
}