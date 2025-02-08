using System.ComponentModel.DataAnnotations;
using JK.Models.Enums;

namespace JK.Models
{
    public class HostServiceView
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string ContactNumber { get; set; }
        public string WebsiteUrl { get; set; }
        public string ServiceType { get; set; } // "Shop" or "Institution"
        public InstitutionType? InstitutionType { get; set; } // Only for Institutions
    }
}
