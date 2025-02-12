// Models/RegisterModel.cs
using System.ComponentModel.DataAnnotations;

public class RegisterModel
{
    [Required]
    public string AccountType { get; set; } // Expected values: "User" or "Host/Service"

    // Fields for User accounts:
    public string FullName { get; set; }

    // Fields for Host/Service accounts:
    public string? ServiceType { get; set; } // e.g., "Shop" or "School/Tuition"
    public string? ServiceName { get; set; }

    // Common fields:
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required, MinLength(6)]
    public string Password { get; set; } = string.Empty;
}
