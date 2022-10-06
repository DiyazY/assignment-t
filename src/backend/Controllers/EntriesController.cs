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
        // GET: api/values
        [HttpGet]
        public IEnumerable<EntryModel> Get()
        {
            var userName = HttpContext?.User?.Identity?.Name ?? "";
            return EntriesService.GetEntries(userName);
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody] EntryModel entry)
        {
            var userName = HttpContext?.User?.Identity?.Name ?? "";
            EntriesService.AddNewEntry(entry, userName);
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}

