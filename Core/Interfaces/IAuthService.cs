using MultitenancyDemo.Core.Entities;
using MultitenancyDemo.Core.Models;

namespace MultitenancyDemo.Core.Interfaces
{
    public interface IAuthService
    {
        Task<User?> RegisterAsync(UserDto request);
        Task<TokenResponseDto?> LoginAsync(UserDto request);
        Task<TokenResponseDto?> RefreshTokensAsync(RefreshTokenRequestDto request);

    }
}
