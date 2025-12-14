using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Extensions;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;

namespace API.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next();

            if (context.HttpContext.User.Identity?.IsAuthenticated != true) return;

            var memberId = resultContext.HttpContext.User.GetMemberId();

            //Service locator pattern
            var dbContext = resultContext.HttpContext.RequestServices
                .GetRequiredService<AppDbContext>();

            await dbContext.Member
                .Where(x => x.Id == memberId)
                .ExecuteUpdateAsync(setter => setter.SetProperty(x => x.LastActive, DateTime.UtcNow));
        }
    }
}