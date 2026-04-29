using Microsoft.AspNetCore.Mvc;
using MultitenancyDemo.Core.Interfaces;

namespace MultitenancyDemo.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class DocumentsController : ControllerBase
{
    private readonly IDocumentService _service;

    public DocumentsController(IDocumentService service) => _service = service;

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var document = await _service.GetByIdAsync(id);
        return document is null ? NotFound() : Ok(document);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _service.GetAllAsync());

    [HttpPost("upload")]
    [Consumes("multipart/form-data")]
    [Produces("application/json")]
    public async Task<IActionResult> Upload([FromForm] UploadDocumentRequest request)
    {
        try
        {
            var document = await _service.UploadAsync(request.Name, request.Description, request.UserId, request.File);
            return CreatedAtAction(nameof(GetById), new { id = document.Id }, document);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}

public record UploadDocumentRequest(string Name, string Description, Guid UserId, IFormFile File);
