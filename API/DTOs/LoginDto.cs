using System;

namespace API.DTOs;

public class LoginDto
{
  public string Email { get; set; } = String.Empty;
  public string Password { get; set; } = String.Empty;
}
