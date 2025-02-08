using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using JK.Models;

namespace JK.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) 
            : base(options) { }
        public DbSet<RefreshToken> RefreshTokens { get; set; }

    }

    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; }
    }
}
