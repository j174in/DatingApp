using API.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

builder.Services.AddCors();

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

app.UseCors(x =>
{
    x.AllowAnyHeader()
     .AllowAnyMethod()
     .WithOrigins(
        "http://localhost:4200",
        "https://localhost:4200"
     );
});

//Configure HTTP request Pipeline
app.MapControllers();
 
app.Run();
