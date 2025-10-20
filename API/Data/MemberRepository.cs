using System;
using API.Entities;
using API.Interfaces;
using Microsoft.CodeAnalysis.Operations;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class MemberRepository(AppDbContext context) : IMemberRepository
{
  public async Task<Member?> GetMemberByIdAsync(string id)
  {
    return await context.Member.FindAsync(id);
  }

  public async Task<IReadOnlyList<Member>> GetMembersAsync()
  {
    return await context.Member.ToListAsync();
  }

  public async Task<IReadOnlyList<Photo>> GetPhotosForMemberAsync(string memberId)
  {
    return await context.Member
    .Where(x => x.Id == memberId)
    .SelectMany(x => x.Photos)
    .ToListAsync();
  }

  public async Task<bool> SaveAllAsync()
  {
    return await context.SaveChangesAsync() > 0;
  }

  public void Update(Member member)
  {
    context.Entry(member).State = EntityState.Modified;
  }
}
