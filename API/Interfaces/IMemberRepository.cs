using System;
using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface IMemberRepository
{
  void Update(Member member);
  Task<PaginatedResults<Member>> GetMembersAsync(MemberParams memberParams);
  Task<Member?> GetMemberByIdAsync(String id);
  Task<IReadOnlyList<Photo>> GetPhotosForMemberAsync(string memberId, bool isCurrentUser);
  Task<Member?> GetMemberForUpdateAsync(string memberId);


}
