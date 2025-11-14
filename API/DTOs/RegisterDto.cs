using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

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

        [Required]
        public string Gender { get; set; } = "";

        [Required]
        public string City { get; set; } = "";

        [Required]
        public string Country { get; set; } = "";

        [Required]
        public DateOnly DateOfBirth { get; set; }



    }
}