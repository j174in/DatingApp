using API.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

//Adding DbContext
builder.Services.AddDbContext<AppDbContext>(opt =>
{
    opt.UseSqlServer(
        builder.Configuration.GetConnectionString(
            "DefaultConnection"
        )
    );
});

var app = builder.Build();

//Configure HTTP request Pipeline
app.MapControllers();
 
app.Run();
