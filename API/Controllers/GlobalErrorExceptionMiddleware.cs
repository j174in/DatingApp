using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using API.Errors;

namespace API.Controllers;

public class GlobalErrorExceptionMiddleware(
  RequestDelegate next, ILogger<GlobalErrorExceptionMiddleware> logger, IHostEnvironment env)
{
  public async Task InvokeAsync(HttpContext context)
  {
    try
    {
      await next(context);
    }
    catch (Exception ex)
    {
      logger.LogError(ex, ex.Message);

      context.Response.ContentType = "application/json";
      context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

      var response = env.IsDevelopment()
        ? new ApiException(context.Response.StatusCode, ex.Message, ex.StackTrace)
        : new ApiException(context.Response.StatusCode, ex.Message, "Internal Server Error");

      var option = new JsonSerializerOptions
      {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
      };

      var json = JsonSerializer.Serialize(response, option);

      await context.Response.WriteAsync(json);
    }
  }

}

public static class ErrorMiddlewareExtensions
{
  public static IApplicationBuilder UseGlobalErrorException(this IApplicationBuilder applicationBuilder)
  {
    return applicationBuilder.UseMiddleware<GlobalErrorExceptionMiddleware>();
  }
}

