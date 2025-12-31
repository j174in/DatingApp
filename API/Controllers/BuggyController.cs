using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BuggyController : BaseApiController
    {
        [HttpGet("auth")]
        public ActionResult GetAuth()
        {
            return Unauthorized();
        }

        [HttpGet("not-found")]
        public ActionResult GetNotFound()
        {
            return NotFound();
        }

        [HttpGet("server-error")]
        public ActionResult GetServerError()
        {
            throw new Exception("Server error occured");
        }

        [HttpGet("bad-request")]
        public ActionResult GetBadRequest()
        {
            return BadRequest("This is a bad request");
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("admin-secret")]
        public ActionResult GetAdminSecret()
        {
            return Ok("This can be only accessed by admin");
        }


    }
}
