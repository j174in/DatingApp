using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface ILikesRepository
    {
        Task<MemberLike?> GetMemberLike(string sourceMemberId, string targetMemberId);
        Task<PaginatedResults<Member>> GetMemberLikes(LikeParams likeParams);
        Task<IReadOnlyList<string>> GetCurrentMemberLikeIds(string memberId);
        void Delete(MemberLike like);
        void Add(MemberLike like);
        Task<bool> SaveAllChangesAsync();

    }
}