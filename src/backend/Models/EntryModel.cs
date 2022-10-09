using System;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class EntryModel
    {
        [Required]
        public string ProductName { get; set; } = string.Empty;
        [Required]
        public DateTime ConsumedAt { get; set; }
        [Required]
        public int Calories { get; set; }
        public int Id { get; set; }

        internal string UserName { get; set; } = string.Empty;
    }
}

