using Microsoft.AspNetCore.Mvc;
using MultitenancyDemo.Core.Interfaces;

namespace MultitenancyDemo.Api.Controllers;

[Route("api/team")]
[ApiController]
public class TeamController : ControllerBase
{
    private readonly IDocumentService _service;

    public TeamController(IDocumentService service) => _service = service;

    [HttpPost("upload")]
    [Consumes("multipart/form-data")]
    [Produces("application/json")]
    public async Task<IActionResult> Upload([FromForm] UploadDocumentRequest request)
    {
        try
        {
            var document = await _service.UploadAsync(request.Name, request.Description, request.File);
            return Ok(document);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}

public record UploadDocumentRequest(string Name, string Description, IFormFile File);
