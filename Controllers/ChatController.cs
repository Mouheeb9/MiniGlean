using Microsoft.AspNetCore.Mvc;
using MultitenancyDemo.Core.Interfaces;
using MultitenancyDemo.Core.Models;

namespace MultitenancyDemo.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly IRagService _ragService;

    public ChatController(IRagService ragService)
    {
        _ragService = ragService;
    }

    [HttpPost]
    public async Task<IActionResult> Ask([FromBody] ChatRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Question))
            return BadRequest("Question is required.");

        var response = await _ragService.AskAsync(request);
        return Ok(response);
    }
}