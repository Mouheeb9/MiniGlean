using MultitenancyDemo.Core.Models;

namespace MultitenancyDemo.Core.Interfaces;

public interface IRagService
{
    Task<ChatResponse> AskAsync(ChatRequest request);
}