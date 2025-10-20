using System;
using System.Text.Json.Serialization;

namespace API.Entities;

public class Photo
{
  public int Id { get; set; }
  public required string Url { get; set; }
  public string? PublicId { get; set; }

  //Navigation Properties
  [JsonIgnore]
  public Member Member { get; set; } = null!;
  public string MemberId { get; set; } = null!;

  //for navigation properties we don't make it required EF has problems with that
  //the a member would have many photos.. photos -> member (many to one)

}
