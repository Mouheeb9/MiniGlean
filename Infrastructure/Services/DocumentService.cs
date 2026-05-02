using Microsoft.EntityFrameworkCore;
using MultitenancyDemo.Core.Entities;
using MultitenancyDemo.Core.Interfaces;
using MultitenancyDemo.Infrastructure.Persistence;

namespace MultitenancyDemo.Infrastructure.Services;

public class DocumentService : IDocumentService
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _config;
    private readonly string _uploadPath;

    public DocumentService(ApplicationDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
        _uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");

        if (!Directory.Exists(_uploadPath))
            Directory.CreateDirectory(_uploadPath);
    }

    public async Task<Document> UploadAsync(string name, string description, IFormFile file)
    {
        if (file == null || file.Length == 0)
            throw new ArgumentException("File is required");

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        var allowedExtensions = new[] { ".pdf", ".txt", ".docx" };
        if (!allowedExtensions.Contains(extension))
            throw new ArgumentException("Only PDF, TXT, or DOCX files are allowed");

        var fileName = $"{Guid.NewGuid()}_{file.FileName}";
        var filePath = Path.Combine(_uploadPath, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var document = new Document(
            name,
            description,
            extension.TrimStart('.'),
            filePath,
            file.Length
        );

        _context.Documents.Add(document);
        await _context.SaveChangesAsync();
        return document;
    }

    public async Task<Document?> GetByIdAsync(int id) =>
        await _context.Documents.FindAsync(id);

    public async Task<IReadOnlyList<Document>> GetAllAsync() =>
        await _context.Documents.ToListAsync();
}
