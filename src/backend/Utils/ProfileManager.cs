using System;
using backend.Models;

namespace backend.Utils
{
    public static class ProfileManager
    {
        public static ProfileDTO GetProfile(string userName)
        {
            ArgumentNullException.ThrowIfNull(userName);
            var profile = new ProfileDTO {
                Role = AuthManager.GetUserRole(userName),
                UserName = userName
            };
            if(userName == "user1")
            {
                profile.Threshold = 1800;
            }
            return profile;
        }

        public static IEnumerable<ProfileDTO> GetAllProfiles()
        {
            List<ProfileDTO> profiles = new List<ProfileDTO>();
            var users = AuthManager.GetAllUsers();
            foreach (var user in users)
            {
                profiles.Add(GetProfile(user));
            }            
            return profiles.Where(p=>p.Role != "Admin");
        }
    }
}

