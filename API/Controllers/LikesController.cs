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
    public class LikesController(IUnitOfWork uow) : BaseApiController
    {
        [HttpPost("{targetMemberId}")]
        public async Task<ActionResult> ToggleLike(string targetMemberId)
        {
            var sourceMemberId = User.GetMemberId();

            var existinglike = await uow.LikesRepository.GetMemberLike(sourceMemberId, targetMemberId);

            if (existinglike == null)
            {
                var like = new MemberLike
                {
                    SourceMemberId = sourceMemberId,
                    TargetMemberId = targetMemberId
                };
                uow.LikesRepository.Add(like);
            }
            else
            {
                uow.LikesRepository.Delete(existinglike);
            }

            if (await uow.Complete()) return Ok();

            return BadRequest("Error on adding like.");
        }

        [HttpGet("list")]
        public async Task<ActionResult<IReadOnlyList<string>>> GetCurrentMemberLikeIds()
        {
            return Ok(await uow.LikesRepository.GetCurrentMemberLikeIds(User.GetMemberId()));
        }

        [HttpGet()]
        public async Task<ActionResult<IReadOnlyList<Member>>> GetMemberLikes([FromQuery] LikeParams likeParams)
        {
            likeParams.CurrentUserId = User.GetMemberId();
            return Ok(await uow.LikesRepository.GetMemberLikes(likeParams));
        }

    }
}