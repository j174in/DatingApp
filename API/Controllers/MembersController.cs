using System.Security.Claims;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class MembersController(IMemberRepository memberRepository) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<AppUser>>> GetMembers()
        {
            // var members = await context.users.ToListAsync();

            // return members;

            return Ok(await memberRepository.GetMembersAsync());
        }

        // [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<ActionResult<Member>> GetMember(string id)
        {
            // var member = context.users.Find(id);
            //Only works for primary key

            var member = await memberRepository.GetMemberByIdAsync(id);

            if (member == null) return NotFound();

            return member;
        }

        [HttpGet("{id}/photos")]
        public async Task<ActionResult<IReadOnlyList<Photo>>> GetMemberAsync(string id)
        {
            return Ok(await memberRepository.GetPhotosForMemberAsync(id));
        }

        [HttpPut]
        public async Task<ActionResult> UpdateMember(MemberUpdateDto memberUpdateDto)
        {
            // var memberId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // if (memberId == null) return BadRequest("Oops - no id found in token");

            var memberId = User.GetMemberId();

            var member = await memberRepository.GetMemberForUpdateAsync(memberId);

            if (member == null) return BadRequest("Member not found");

            member.DisplayName = memberUpdateDto.DisplayName ?? member.DisplayName;
            member.Description = memberUpdateDto.Description ?? member.Description;
            member.City = memberUpdateDto.City ?? member.City;
            member.Country = memberUpdateDto.Country ?? member.Country;

            member.User.DisplayName = memberUpdateDto.DisplayName ?? member.DisplayName;

            // memberRepository.Update(member); //optional 

            if (await memberRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to update member");


        }
    }
}
