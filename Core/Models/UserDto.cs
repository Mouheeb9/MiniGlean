using System.ComponentModel.DataAnnotations;

namespace MultitenancyDemo.Core.Models
{
    public class UserDto
    {
        [Required(ErrorMessage = "Ekteb esmek !!!!")]
        [RegularExpression(@"^M.*0$", ErrorMessage = "Name must start with 'M' and end with '0'")]
        public String Name { get; set; }
        [Required(ErrorMessage = "wel mdp chaamalna feha  !!!!")]
        public String Password { get; set; }

    }
}
