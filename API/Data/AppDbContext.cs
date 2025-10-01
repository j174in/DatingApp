using API.Entities;
using Microsoft.EntityFrameworkCore;
namespace API.Data;

public class AppDbContext(DbContextOptions options) : DbContext(options)
{
    // public AppDbContext(DbContextOptions options) : base(options)
    public DbSet<AppUser> users { get; set; }

}
