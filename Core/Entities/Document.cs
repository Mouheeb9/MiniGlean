using MultitenancyDemo.Core.Contracts;

namespace MultitenancyDemo.Core.Entities;

public class Document : BaseEntity, IMustHaveTenant
{
    public Document(string name, string description, Guid userId, string type, string filePath, long fileSize)
    {
        Name = name;
        Description = description;
        UserId = userId;
        Type = type;
        FilePath = filePath;
        FileSize = fileSize;
        UploadedAt = DateTime.UtcNow;
    }

    protected Document() { }

    public string Name { get; private set; } = default!;
    public string Description { get; private set; } = default!;
    public Guid UserId { get; private set; }
    public string Type { get; private set; } = default!;
    public string FilePath { get; private set; } = default!;
    public long FileSize { get; private set; }
    public DateTime UploadedAt { get; private set; }
    public string TenantId { get; set; } = default!;
}
