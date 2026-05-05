namespace MultitenancyDemo.Core.Models;

public class ChatResponse
{
    public string Answer { get; set; } = string.Empty;
    public string TenantId { get; set; } = string.Empty;
}