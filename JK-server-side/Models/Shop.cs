using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace JK.Models
{
    public class Shop : HostService
    {
        [Required]
        public bool HasOnlineOrdering { get; set; } = true;

        public ICollection<Product> Products { get; set; } = new List<Product>();
    }

    public class Product
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string Name { get; set; }

        [Required]
        public decimal Price { get; set; }

        [MaxLength(500)]
        public string Description { get; set; }

        public string ImageUrl { get; set; }

        public int ShopId { get; set; }
        public Shop Shop { get; set; }
    }
}
