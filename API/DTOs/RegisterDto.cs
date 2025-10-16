using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class RegisterDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = String.Empty;

        [Required]
        public string DisplayName { get; set; } = String.Empty;

        [Required]
        [MinLength(4)]
        public string Password { get; set; } = String.Empty;

    }
}