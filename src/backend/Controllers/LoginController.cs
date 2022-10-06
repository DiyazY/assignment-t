using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using backend.Models;
using backend.Utils;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    public class LoginController : Controller
    {

        [HttpPost, Route("login")]
        public IActionResult Login(LoginDTO loginDTO)
        {
            try
            {
                if (string.IsNullOrEmpty(loginDTO.UserName) || string.IsNullOrEmpty(loginDTO.Password))
                {
                    return BadRequest("Username or Password is not specified!");
                }
                if (AuthManager.CheckPassword(loginDTO.UserName, loginDTO.Password))
                {
                    var claims = new[] {
                        new Claim(ClaimTypes.Name, loginDTO.UserName),
                        new Claim(ClaimTypes.Role, AuthManager.GetUserRole(loginDTO.UserName))
                    };

                    var creds = new SigningCredentials(AuthManager.GetKey(), SecurityAlgorithms.HmacSha256);
                    var jwtSecurityToken = new JwtSecurityToken(
                        audience: AuthManager.GetAudience(),
                        issuer: AuthManager.GetIssuer(),
                        claims: claims,
                        expires: DateTime.Now.AddMinutes(10),
                        signingCredentials: creds
                    );
                    return Ok(new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken));
                }
            }
            catch
            {
                return BadRequest("Token generating error!");
            }
            return Unauthorized();
        }
    }
}

