using System;
using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController(UserManager<AppUser> userManager, ITokenService tokenService) : BaseApiController
{
  [HttpPost("register")]
  public async Task<ActionResult<UserDto>> Register(RegisterDto register)
  {
    //If the parameters are all strings then in method then athe asp.net core 
    //look only on querystring and doesn't look on the body


    var user = new AppUser
    {
      Email = register.Email,
      DisplayName = register.DisplayName,
      UserName = register.Email,
      Member = new Member
      {
        DisplayName = register.DisplayName,
        Gender = register.Gender,
        City = register.City,
        Country = register.Country,
        DateOfBirth = register.DateOfBirth
      }
    };

    var result = await userManager.CreateAsync(user, register.Password);
    if (!result.Succeeded)
    {
      foreach (var error in result.Errors)
      {
        ModelState.AddModelError("identity", error.Description);
      }
      return ValidationProblem();
    }

    await userManager.AddToRoleAsync(user, "Member");

    await SetRefreshToken(user);

    return await user.ToDto(tokenService);
  }

  [HttpPost("login")]
  public async Task<ActionResult<UserDto>> Login(LoginDto login)
  {
    // var user = await context.users.SingleOrDefaultAsync(x => x.Email == login.Email);
    //throw exception on mutiple values

    var user = await userManager.FindByEmailAsync(login.Email);

    if (user == null) return Unauthorized("Invalid Email");

    var result = await userManager.CheckPasswordAsync(user, login.Password);
    if (!result)
    {
      return Unauthorized("Invalid Password");
    }

    await SetRefreshToken(user);

    return await user.ToDto(tokenService);

  }

  [HttpPost("refresh-token")]
  public async Task<ActionResult<UserDto>> RefreshToken()
  {
    var refreshToken = Request.Cookies["refreshToken"];
    if (refreshToken == null) return NoContent();

    var user = userManager.Users.FirstOrDefault(user => user.RefreshToken == refreshToken && user.RefreshTokenExpiry > DateTime.UtcNow);

    if (user == null) return Unauthorized();

    await SetRefreshToken(user);

    return await user.ToDto(tokenService);

  }

  private async Task SetRefreshToken(AppUser user)
  {
    var refreshToken = tokenService.GetRefreshToken();
    user.RefreshToken = refreshToken;
    user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);

    await userManager.UpdateAsync(user);

    var cookie = new CookieOptions
    {
      HttpOnly = true,
      Secure = true,
      SameSite = SameSiteMode.Strict,
      Expires = DateTime.UtcNow.AddDays(7)
    };

    Response.Cookies.Append("refreshToken", refreshToken, cookie);
  }

  [Authorize]
  [HttpPost("logout")]
  public async Task<ActionResult> Logout()
  {
    await userManager.Users
      .Where(x => x.Id == User.GetMemberId())
      .ExecuteUpdateAsync(x => x
        .SetProperty(setters => setters.RefreshToken, _ => null)
        .SetProperty(setters => setters.RefreshTokenExpiry, _ => null));

    Response.Cookies.Delete("refreshToken");

    return Ok();
  }
}

