using System;
using backend.Models;

namespace backend.Utils
{
    public static class ProfileManager
    {
        public static ProfileDTO GetProfile(string userName)
        {
            ArgumentNullException.ThrowIfNull(userName);
            var profile = new ProfileDTO { Role = AuthManager.GetUserRole(userName)};
            if(userName == "user1")
            {
                profile.Threshold = 1800;
            }
            return profile;
        }
    }
}

