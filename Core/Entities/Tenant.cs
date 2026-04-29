using System.ComponentModel.DataAnnotations;

namespace MultitenancyDemo.Core.Entities;

public class Tenant
{
    [Key]
    public string TID { get; set; } = default!;

    [Required]
    public string Name { get; set; } = default!;

    public string? ConnectionString { get; set; }
}
