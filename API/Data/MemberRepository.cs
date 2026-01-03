using System;
using API.Entities;
using API.Helpers;
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

  public async Task<PaginatedResults<Member>> GetMembersAsync(MemberParams memberParams)
  {
    // return await context.Member.ToListAsync();
    var query = context.Member.AsQueryable();

    query = query.Where(x => x.Id != memberParams.CurrentUserId);

    if (memberParams.Gender != null)
    {
      query = query.Where(x => x.Gender == memberParams.Gender);
    }

    var minDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-memberParams.MaxAge - 1));
    var maxDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-memberParams.MinAge));

    query = query.Where(x => x.DateOfBirth >= minDob && x.DateOfBirth <= maxDob);

    query = memberParams.OrderBy switch
    {
      "created" => query.OrderByDescending(x => x.Created),
      _ => query.OrderByDescending(x => x.LastActive)
    };

    return await PaginationHelper.CreateAsync(query, memberParams.PageSize, memberParams.PageNumber);
  }

  public async Task<IReadOnlyList<Photo>> GetPhotosForMemberAsync(string memberId, bool isCurrentUser)
  {
    var query = context.Member
     .Where(x => x.Id == memberId)
     .SelectMany(x => x.Photos);

    if (isCurrentUser) query = query.IgnoreQueryFilters();

    return await query.ToListAsync();
  }

  public async Task<Member?> GetMemberForUpdateAsync(string memberId)
  {
    return await context.Member
    .Include(x => x.User)
    .Include(x => x.Photos)
    .IgnoreQueryFilters()
    .SingleOrDefaultAsync(x => x.Id == memberId);
  }

  public void Update(Member member)
  {
    context.Entry(member).State = EntityState.Modified;
  }
}
