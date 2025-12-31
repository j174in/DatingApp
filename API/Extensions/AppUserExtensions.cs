using System;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.CodeAnalysis.CSharp;

namespace API.Extensions;

public static class AppUserExtensions
{
  public static async Task<UserDto> ToDto(this AppUser appUser, ITokenService tokenService)
  {
    return new UserDto
    {
      Id = appUser.Id,
      Email = appUser.Email!,
      DisplayName = appUser.DisplayName,
      ImageUrl = appUser.ImageUrl,
      Token = await tokenService.CreateToken(appUser)
    };
  }
}
