using Microsoft.AspNetCore.Mvc;
using MultitenancyDemo.Core.Interfaces;

namespace MultitenancyDemo.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ProductsController : ControllerBase
{
    private readonly IProductService _service;

    public ProductsController(IProductService service) => _service = service;

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var product = await _service.GetByIdAsync(id);
        return product is null ? NotFound() : Ok(product);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _service.GetAllAsync());

    [HttpPost]
    public async Task<IActionResult> Create(CreateProductRequest request) =>
        Ok(await _service.CreateAsync(request.Name, request.Description, request.Rate));
}

public record CreateProductRequest(string Name, string Description, int Rate);