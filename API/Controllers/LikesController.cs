using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace API.Controllers
{
    public class LikesController(ILikesRepository likesRepository) : BaseApiController
    {
        [HttpPost("{targetMemberId}")]
        public async Task<ActionResult> ToggleLike(string targetMemberId)
        {
            var sourceMemberId = User.GetMemberId();

            var existinglike = await likesRepository.GetMemberLike(sourceMemberId, targetMemberId);

            if (existinglike == null)
            {
                var like = new MemberLike
                {
                    SourceMemberId = sourceMemberId,
                    TargetMemberId = targetMemberId
                };
                likesRepository.Add(like);
            }
            else
            {
                likesRepository.Delete(existinglike);
            }

            if (await likesRepository.SaveAllChangesAsync()) return Ok();

            return BadRequest("Error on adding like.");
        }

        [HttpGet("list")]
        public async Task<ActionResult<IReadOnlyList<string>>> GetCurrentMemberLikeIds()
        {
            return Ok(await likesRepository.GetCurrentMemberLikeIds(User.GetMemberId()));
        }

        [HttpGet()]
        public async Task<ActionResult<IReadOnlyList<Member>>> GetMemberLikes([FromQuery] LikeParams likeParams)
        {
            likeParams.CurrentUserId = User.GetMemberId();
            return Ok(await likesRepository.GetMemberLikes(likeParams));
        }

    }
}