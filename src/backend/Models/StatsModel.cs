using System;
namespace backend.Models
{
    public class StatsModel
    {
        public int AddedEntriesForSevenDays { get; set; }
        public int AddedEntriesPrevWeek { get; set; }

        public double AverageCaloriesForSevenDays { get; set; }
    }
}

