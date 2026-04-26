using System.ComponentModel.DataAnnotations;

namespace MultitenancyDemo.Core.Entities
{
    public class User
    {
        public Guid Id { get; set; }
        [Required(ErrorMessage = "Ekteb esmek !!!!")]
        public string Name { get; set; } = string.Empty;
        public String HashPassword { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string? RefreshToken { get; set; }
        public DateTime RefreshTokenExpiryTime { get; set; }
    }
}
