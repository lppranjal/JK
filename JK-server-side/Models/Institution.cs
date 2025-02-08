using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using JK.Models.Enums;

namespace JK.Models
{
    public class Institution : HostService
    {
        [Required]
        public InstitutionType Type { get; set; }

        [Required]
        public bool HasAdmissionForms { get; set; } = true;

        [MaxLength(1000)]
        public string FeeStructure { get; set; }

        [MaxLength(500)]
        public string CoursesOffered { get; set; }
    }
}
