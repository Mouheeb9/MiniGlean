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

}
