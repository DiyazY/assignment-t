using System;
using System.Text;
using backend.Models;
using Microsoft.IdentityModel.Tokens;

namespace backend.Utils
{
    public class AuthManager
    {
        private static List<LoginDTO> _authDb = new List<LoginDTO> // for the sake of simplicity, I am using the same model here
        {
            new LoginDTO(){UserName = "diyaz", Password="diyaz"},
            new LoginDTO(){UserName = "user1", Password="user1"},
            new LoginDTO(){UserName = "user2", Password="user2"},
        };

        public static bool CheckPassword(string userName, string password)
        {
            var user = _authDb.Find(p => p.UserName == userName);
            if (user?.Password == password)
            {
                return true;
            }
            return false;
        }

        public static string GetUserRole(string userName)
        {
            return userName == "diyaz" ? "Admin" : "User";
        }

        public static SymmetricSecurityKey GetKey()
        {
            return new SymmetricSecurityKey(Encoding.UTF8.GetBytes("toptal_secretkey@123"));
        }

        public static string GetIssuer() => "toptal";
        public static string GetAudience() => "https://localhost:7033";

    }
}

