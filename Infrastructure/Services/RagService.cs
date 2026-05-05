using System.Net.Http.Json;
using MultitenancyDemo.Core.Interfaces;
using MultitenancyDemo.Core.Models;

namespace MultitenancyDemo.Infrastructure.Services;

public class RagService : IRagService
{
    private readonly HttpClient _httpClient;

    public RagService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<ChatResponse> AskAsync(ChatRequest request)
    {
        var response = await _httpClient.PostAsJsonAsync("/chat", request);

        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<ChatResponse>();

        return result!;
    }
}