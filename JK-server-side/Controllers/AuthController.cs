using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using JK.Data;
using JK.Models;

namespace JK.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ApplicationDbContext _dbContext;
        private readonly IConfiguration _configuration;

        public AuthController(UserManager<ApplicationUser> userManager, 
                              SignInManager<ApplicationUser> signInManager, 
                              ApplicationDbContext dbContext, 
                              IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _dbContext = dbContext;
            _configuration = configuration;
        }

        [HttpPost("login")]
public async Task<IActionResult> Login([FromBody] LoginModel model)
{
    var user = await _userManager.FindByEmailAsync(model.Email);
    if (user == null || !(await _userManager.CheckPasswordAsync(user, model.Password)))
        return Unauthorized(new { message = "Invalid credentials" });

    var jwtToken = GenerateJwtToken(user);
    var refreshToken = GenerateRefreshToken(user);

    // Store refresh token in an HTTP-only cookie
    var cookieOptions = new CookieOptions
    {
        HttpOnly = true,
        Secure = true, // Use HTTPS
        Expires = refreshToken.ExpiryDate
    };
    Response.Cookies.Append("refreshToken", refreshToken.Token, cookieOptions);

    return Ok(new { token = jwtToken });
}


        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest model)
        {
            var storedToken = _dbContext.RefreshTokens.FirstOrDefault(rt => rt.Token == model.RefreshToken);
            if (storedToken == null || storedToken.IsRevoked || storedToken.ExpiryDate < DateTime.UtcNow)
                return Unauthorized(new { message = "Invalid or expired refresh token" });

            var user = await _userManager.FindByIdAsync(storedToken.UserId);
            if (user == null) return Unauthorized(new { message = "User not found" });

            // Revoke the old refresh token
            storedToken.IsRevoked = true;
            await _dbContext.SaveChangesAsync();

            // Generate new JWT and refresh token
            var jwtToken = GenerateJwtToken(user);
            var newRefreshToken = GenerateRefreshToken(user);

            return Ok(new { token = jwtToken, refreshToken = newRefreshToken.Token });
        }

        private string GenerateJwtToken(ApplicationUser user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Name, user.Email)
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Issuer"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(15), // Short-lived access token
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private RefreshToken GenerateRefreshToken(ApplicationUser user)
        {
            var refreshToken = new RefreshToken
            {
                Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
                ExpiryDate = DateTime.UtcNow.AddDays(7),
                UserId = user.Id
            };

            _dbContext.RefreshTokens.Add(refreshToken);
            _dbContext.SaveChanges();
            return refreshToken;
        }
    }

    public class RefreshTokenRequest
    {
        public string RefreshToken { get; set; }
    }

    public class LoginModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
