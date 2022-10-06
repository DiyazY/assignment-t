using System;
namespace backend.Models
{
    public class ProfileDTO
    {
        public string Role { get; set; } = "User";
        public int Threshold { get; set; } = 2100;
        public string UserName { get; set; } = string.Empty;
    }
}

