using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class LikesRepository(AppDbContext context) : ILikesRepository
    {
        public void Add(MemberLike like)
        {
            context.Likes.Add(like);
        }

        public void Delete(MemberLike like)
        {
            context.Likes.Remove(like);
        }

        public async Task<IReadOnlyList<string>> GetCurrentMemberLikeIds(string? memberId)
        {
            //We need to use projection. Projection means select
            //The current user liked users
            return await context.Likes
            .Where(x => x.SourceMemberId == memberId)
            .Select(x => x.TargetMemberId)
            .ToListAsync();
        }

        public async Task<MemberLike?> GetMemberLike(string sourceMemberId, string targetMemberId)
        {
            return await context.Likes.FindAsync(sourceMemberId, targetMemberId);
        }

        public async Task<PaginatedResults<Member>> GetMemberLikes(LikeParams likeParams)
        {
            var query = context.Likes.AsQueryable();
            IQueryable<Member> result;

            switch (likeParams.Predicate)
            {
                case "liked":
                    result = query
                     .Where(x => x.SourceMemberId == likeParams.CurrentUserId)
                     .Select(x => x.TargetMember);
                    break;
                case "likedBy":
                    result = query
                    .Where(x => x.TargetMemberId == likeParams.CurrentUserId)
                    .Select(x => x.SourceMember);
                    break;
                default: //mutual
                    var liked = await GetCurrentMemberLikeIds(likeParams.CurrentUserId);

                    result = query
                    .Where(x => x.TargetMemberId == likeParams.CurrentUserId && liked.Contains(x.SourceMemberId))
                    .Select(x => x.SourceMember);
                    break;
            }

            return await PaginationHelper.CreateAsync(result, likeParams.PageSize, likeParams.PageNumber);
        }

        public async Task<bool> SaveAllChangesAsync()
        {
            return await context.SaveChangesAsync() > 0;
        }
    }
}