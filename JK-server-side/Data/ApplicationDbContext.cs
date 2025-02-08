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
        public DbSet<Shop> Shops { get; set; }
        public DbSet<Institution> Institutions { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<HostServiceView> HostServices { get; set; }  // For SQL View

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Discriminator setup for Table Per Hierarchy (TPH) 
            modelBuilder.Entity<HostService>()
                .HasDiscriminator<string>("ServiceType")
                .HasValue<Shop>("Shop")
                .HasValue<Institution>("Institution");

            modelBuilder.Entity<Product>()
                .HasOne(p => p.Shop)
                .WithMany(s => s.Products)
                .HasForeignKey(p => p.ShopId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<HostServiceView>()
                .ToView("vw_HostServices")
                .HasKey(h => h.Id);
            
        }

    }

    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; }
    }
}
