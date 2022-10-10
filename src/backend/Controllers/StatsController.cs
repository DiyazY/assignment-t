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
    [Route("api/[controller]"), Authorize(Roles ="Admin")]
    public class StatsController : Controller
    {


        // TODO: this part could be done better, performance-wise it is not a good solution!
        [HttpGet("{userName}")]
        public StatsModel Get([FromRoute]string userName)
        {
            var entries = EntriesService.GetEntries(userName);
            var lastSevenDaysEntries = entries.Where(p => p.ConsumedAt >= DateTime.Now.AddDays(-7));
            var theWeekBeforeEntries = entries.Where(p => p.ConsumedAt >= DateTime.Now.AddDays(-14) && p.ConsumedAt < DateTime.Now.AddDays(-7));
            return new StatsModel
            {
                AddedEntriesForSevenDays = lastSevenDaysEntries.Count(),
                AddedEntriesPrevWeek = theWeekBeforeEntries.Count(),
                AverageCaloriesForSevenDays = lastSevenDaysEntries.Average(p => p.Calories)
            };
        }
    }
}

