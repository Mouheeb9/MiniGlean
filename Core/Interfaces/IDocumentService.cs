using MultitenancyDemo.Core.Entities;

namespace MultitenancyDemo.Core.Interfaces;

public interface IDocumentService
{
    Task<Document> UploadAsync(string name, string description, IFormFile file);
    Task<Document?> GetByIdAsync(int id);
    Task<IReadOnlyList<Document>> GetAllAsync();
}