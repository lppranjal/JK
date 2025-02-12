// Controllers/AccountController.cs
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using JK.Data;   // Adjust namespace as needed

namespace JK.Controllers {
    [Route("api/account")]
    [ApiController]
public class AccountController : ControllerBase
{

    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ApplicationDbContext _context;

    public AccountController(UserManager<ApplicationUser> userManager, ApplicationDbContext context)
    {
        _userManager = userManager;
        _context = context;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterModel model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // Create an Identity user (common for both account types)
        var user = new ApplicationUser
        {
            UserName = model.Email,
            Email = model.Email,
            FullName = model.FullName
        };

        try {
var result = await _userManager.CreateAsync(user, model.Password);
if (!result.Succeeded)
        {
            // Return errors if registration fails.
            return BadRequest(result.Errors);
        }
        }
        catch(Exception ex) {
            int a =10;
        }
        

        // Based on account type, store additional details:
        if (model.AccountType == "Host/Service")
        {
            // Validate that host/service-specific fields are provided.
            if (string.IsNullOrWhiteSpace(model.ServiceType) ||
                string.IsNullOrWhiteSpace(model.ServiceName))
            {
                return BadRequest("Service Type and Service Name are required for Host/Service accounts.");
            }

            var serviceProvider = new ServiceProvider
            {
                UserId = user.Id,
                ServiceType = model.ServiceType,
                ServiceName = model.ServiceName
            };

            _context.ServiceProviders.Add(serviceProvider);
            await _context.SaveChangesAsync();
        }
        else if (model.AccountType == "User")
        {
            // Optionally, store additional profile details for regular users in another table
            // (for this example, we’re keeping it simple).
        }

        // Registration was successful. Return an OK response.
        return Ok(new { message = "Registration successful" });
    }
}
}


