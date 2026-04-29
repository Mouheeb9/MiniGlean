using MultitenancyDemo.Core.Entities;

namespace MultitenancyDemo.Core.Interfaces;

public interface IDocumentService
{
    Task<Document> UploadAsync(string name, string description, Guid userId, IFormFile file);
    Task<Document?> GetByIdAsync(int id);
    Task<IReadOnlyList<Document>> GetAllAsync();
}
