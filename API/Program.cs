using API.Data;
using API.Interfaces;
using API.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using API.Controllers;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

builder.Services.AddCors();
builder.Services.AddScoped<ITokenService, TokenService>();

//Adding DbContext
builder.Services.AddDbContext<AppDbContext>(opt =>
{
    opt.UseSqlServer(
        builder.Configuration.GetConnectionString(
            "DefaultConnection"
        )
    );
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme )
    .AddJwtBearer(options =>
    {
        var tokenKey = builder.Configuration["TokenKey"]
            ?? throw new Exception("Token key not provided - Program.cs");
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey)),
            ValidateAudience = false,
            ValidateIssuer = false,
        };

    });

var app = builder.Build();
app.UseGlobalErrorException();
app.UseCors(x =>
{
    x.AllowAnyHeader()
     .AllowAnyMethod()
     .WithOrigins(
        "http://localhost:4200",
        "https://localhost:4200"
     );
});

app.UseAuthentication();
app.UseAuthorization();

//Configure HTTP request Pipeline
app.MapControllers();
 
app.Run();
