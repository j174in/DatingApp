using System;
using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController(AppDbContext context, ITokenService tokenService) : BaseApiController
{
  [HttpPost("register")]
  public async Task<ActionResult<UserDto>> Register(RegisterDto register)
  {
    //If the parameters are all strings then in method then athe asp.net core 
    //look only on querystring and doesn't look on the body

    if (await IfUserExists(register.Email))
    {
      return BadRequest("User Already exists");
    }
    using var hmac = new HMACSHA512();

    var user = new AppUser
    {
      Email = register.Email,
      DisplayName = register.DisplayName,
      PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(register.Password)),
      PasswordSalt = hmac.Key,
      Member = new Member
      {
        DisplayName = register.DisplayName,
        Gender = register.Gender,
        City = register.City,
        Country = register.Country,
        DateOfBirth = register.DateOfBirth
      }
    };

    context.users.Add(user);
    //Why not use async , this is only tracking no I/O bound op
    //Specific usecase, where db needs to generate an id

    await context.SaveChangesAsync();

    return user.ToDto(tokenService);
  }

  [HttpPost("login")]
  public async Task<ActionResult<UserDto>> Login(LoginDto login)
  {
    // var user = await context.users.SingleOrDefaultAsync(x => x.Email == login.Email);
    //throw exception on mutiple values

    var user = await context.users.FirstOrDefaultAsync(x => x.Email == login.Email);

    if (user == null) return Unauthorized("Invalid Email");

    using var hmac = new HMACSHA512(user.PasswordSalt);

    var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(login.Password));

    // if ( computedHash == user.PasswordHash)
    // {
    //   /why not?
    // }

    for (int i = 0; i < computedHash.Length; i++)
    {
      if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid Password");
    }
    return user.ToDto(tokenService);

  }

  private async Task<bool> IfUserExists(string email)
  {
    return await context.users.AnyAsync(user => user.Email.ToLower() == email.ToLower());
  }
}

