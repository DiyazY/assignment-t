using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;
using backend.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace backend.Controllers
{
    [Route("api/[controller]"), Authorize]
    public class EntriesController : Controller
    {
        [HttpGet]
        public IEnumerable<EntryModel> Get()
        {
            var userName = HttpContext?.User?.Identity?.Name ?? "";
            return EntriesService.GetEntries(userName);
        }

        [HttpGet("{userName}")]
        [Authorize(Roles = "Admin")]
        public IEnumerable<EntryModel> Get([FromRoute]string userName)
        {
            return EntriesService.GetEntries(userName);
        }

        [HttpPost]
        public  EntryModel Post([FromBody] EntryModel entry)
        {
            var userName = HttpContext?.User?.Identity?.Name ?? "";
            return EntriesService.AddNewEntry(entry, userName);
        }

        [HttpPost("{userName}")]
        [Authorize(Roles = "Admin")]
        public EntryModel Post([FromBody] EntryModel entry, [FromRoute] string userName)
        {
            return EntriesService.AddNewEntry(entry, userName);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public EntryModel? Put(int id, [FromBody] EntryModel entry)
        {
            return EntriesService.UpdateEntry(id, entry);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public EntryModel? Delete(int id)
        {
            return EntriesService.RemoveEntry(id);
        }
    }
}

