using System;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class PhotoRepository(AppDbContext context) : IPhotoRepository
{
  public async Task<Photo?> GetPhotoById(int id)
  {
    return await context.Photo
      .IgnoreQueryFilters()
      .FirstOrDefaultAsync(x => x.Id == id);
  }

  public async Task<IReadOnlyList<PhotoForApprovalDto>> GetUnapprovedPhotos()
  {
    return await context.Photo
      .IgnoreQueryFilters()
      .Where(x => x.IsApproved == false)
      .Select(p => new PhotoForApprovalDto
      {
        Id = p.Id,
        UserId = p.MemberId,
        Url = p.Url,
        IsApproved = p.IsApproved
      })
      .ToListAsync();
  }

  public void RemovePhoto(Photo photo)
  {
    context.Photo.Remove(photo);
  }
}
