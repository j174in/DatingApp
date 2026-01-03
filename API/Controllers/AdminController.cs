using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace API.Controllers
{
    public class AdminController(IUnitOfWork uow, UserManager<AppUser> userManager, IPhotoService photoService) : BaseApiController
    {
        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("users-with-roles")]
        public async Task<ActionResult> GetUsersWithRoles()
        {
            var users = await userManager.Users.ToListAsync();
            var userList = new List<object>();

            foreach (var user in users)
            {
                var roles = await userManager.GetRolesAsync(user);
                userList.Add(new
                {
                    user.Id,
                    user.Email,
                    user.DisplayName,
                    Roles = roles.ToList()
                });
            }
            return Ok(userList);
        }
        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost("edit-roles/{userid}")]
        public async Task<ActionResult<IList<string>>> EditRoles(string userid, [FromQuery] string roles)
        {
            if (string.IsNullOrEmpty(roles)) return BadRequest("You need to select atleast one role to add");

            var selectedRoles = roles.Split(',').ToArray();

            var user = await userManager.FindByIdAsync(userid);

            if (user == null) return BadRequest("Could not retrive user");

            var userRoles = await userManager.GetRolesAsync(user);

            var result = await userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));

            if (!result.Succeeded) return BadRequest("Error while adding to roles");

            result = await userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));

            if (!result.Succeeded) return BadRequest("Error while removing roles");

            return Ok(await userManager.GetRolesAsync(user));
        }

        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpGet("photos-to-moderate")]
        public async Task<ActionResult<IEnumerable<Photo>>> GetPhotosForModeration()
        {
            return Ok(await uow.PhotoRepository.GetUnapprovedPhotos());
        }

        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpPost("approve-photo/{photoId}")]
        public async Task<ActionResult> ApprovePhoto(int photoId)
        {
            var photo = await uow.PhotoRepository.GetPhotoById(photoId);
            if (photo == null) return BadRequest("Could not get photo from db");

            var member = await uow.MemberRepository.GetMemberForUpdateAsync(photo.MemberId);

            if (member == null) return BadRequest("Could not get member");

            photo.IsApproved = true;

            if (member.ImageUrl == null)
            {
                member.ImageUrl = photo.Url;
                member.User.ImageUrl = photo.Url;
            }

            await uow.Complete();

            return Ok();
        }

        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpPost("reject-photo/{photoId}")]
        public async Task<ActionResult> RejectPhoto(int photoId)
        {
            var photo = await uow.PhotoRepository.GetPhotoById(photoId);
            if (photo == null) return BadRequest("Could not get photo from db");


            if (photo.PublicId != null)
            {
                var result = await photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Result == "ok")
                {
                    uow.PhotoRepository.RemovePhoto(photo);
                }
            }
            else
            {
                uow.PhotoRepository.RemovePhoto(photo);
            }
            await uow.Complete();

            return Ok();
        }
    }
}