using System.ComponentModel.DataAnnotations;

namespace MultitenancyDemo.Core.Models
{
    public class UserDto
    {
        [Required(ErrorMessage = "Ekteb esmek !!!!")]
        public String Name { get; set; }
        [Required(ErrorMessage = "wel mdp chaamalna feha  !!!!")]
        public String Password { get; set; }

    }
}
