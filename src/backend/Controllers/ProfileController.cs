using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;
using backend.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]"), Authorize]
    public class ProfileController : Controller
    {
        [HttpGet]
        public ProfileDTO Get()
        {
            var userName = HttpContext?.User?.Identity?.Name ?? "";
            return ProfileManager.GetProfile(userName);
        }

        [HttpGet("{userName}")]
        [Authorize(Roles ="Admin")]
        public ProfileDTO Get([FromRoute] string userName)
        {
            return ProfileManager.GetProfile(userName);
        }
    }
}

