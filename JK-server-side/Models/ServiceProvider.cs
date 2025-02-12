// Models/ServiceProvider.cs
using JK.Data;
public class ServiceProvider
{
    public int Id { get; set; }
    // Reference the ApplicationUser created via ASP.NET Core Identity.
    public string UserId { get; set; } = string.Empty;
    public string ServiceType { get; set; } = string.Empty;
    public string ServiceName { get; set; } = string.Empty;
    
    // Optional: Navigation property to ApplicationUser.
    public ApplicationUser? User { get; set; }
}
