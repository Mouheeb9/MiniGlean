using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MultitenancyDemo.Core.Entities;
using MultitenancyDemo.Core.Interfaces;
using MultitenancyDemo.Core.Models;

namespace MultitenancyDemo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(IAuthService authService) : ControllerBase
    {
        [HttpPost("Register")]
        public async Task<ActionResult<User>> Register(UserDto request)
        {
            var user = await authService.RegisterAsync(request);
            if (user is null)
                return BadRequest("Username already exists");

            return Ok(user);
        }


        [HttpPost("Login")]
        public async Task<ActionResult<string>> Login(UserDto request)
        {
            var response = await authService.LoginAsync(request);
            if (response == null)
            {
                return BadRequest("Username or password is incorrect");

            }

            return Ok(response);
        }
        [HttpGet("AuthorizedOnly")]
        [Authorize]
        public IActionResult AuthenticatedOnlyEndPoint()
        {
            return Ok("You are authenticated");
        }

        [HttpGet("AdminOnly")]
        [Authorize(Roles = "Admin")]
        public IActionResult AdminOnlyEndPoint()
        {
            return Ok("You are an admin Sahiiiit !");
        }


        [HttpPost("refresh-token")]
        public async Task<ActionResult<TokenResponseDto>> RefreshToken(RefreshTokenRequestDto request)
        {
            var result = await authService.RefreshTokensAsync(request);

            if (result is null || result.AccessToken is null || result.RefreshToken is null)
            {
                return Unauthorized("Invalid refresh token.");
            }

            return Ok(result);
        }

    }
}
