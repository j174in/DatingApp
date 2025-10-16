using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using YamlDotNet.Core.Tokens;

namespace API.Services;

public class TokenService(IConfiguration configuration) : ITokenService
{
  //Consider it a service if its typlically not communicating with db and 
  //ANy third party service we are using
  public string CreateToken(AppUser user)
  {
    var tokenKey = configuration["TokenKey"] ?? throw new Exception("Cannot get token key");
    if (tokenKey.Length < 64) throw new Exception("User token key is less than or equal to 64.");

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey));

    var claims = new List<Claim>
    {
      new Claim(ClaimTypes.Email, user.Email),
      new Claim(ClaimTypes.NameIdentifier, user.Id)
      // new Claim ("Claimwhatever", "value")
    };

    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

    var tokenDescriptor = new SecurityTokenDescriptor
    {
      Subject = new ClaimsIdentity(claims),
      Expires = DateTime.UtcNow.AddDays(7),
      SigningCredentials = creds
    };

    var tokenHandler = new JwtSecurityTokenHandler();

    var token = tokenHandler.CreateToken(tokenDescriptor);

    return tokenHandler.WriteToken(token);
  }
}
