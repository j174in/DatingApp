using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MembersController(AppDbContext context) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<AppUser>>> GetMembers()
        {
            var members = await context.users.ToListAsync();

            return members;
        }

        [HttpGet("{id}")]
        public ActionResult<AppUser> GetMember(string id)
        {
            var member = context.users.Find(id);
            //Only works for primary key

            if (member == null) return NotFound();

            return member;
        }
    }
}
