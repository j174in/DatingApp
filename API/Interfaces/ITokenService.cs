using System;
using API.Entities;

namespace API.Interfaces;

public interface ITokenService
{
  Task<string> CreateToken(AppUser user);
  string GetRefreshToken();
}
