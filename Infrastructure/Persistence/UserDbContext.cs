using Microsoft.EntityFrameworkCore;
using MultitenancyDemo.Core.Entities;

namespace MultitenancyDemo.Infrastructure.Persistence;

public class UserDbContext : DbContext
{
    public UserDbContext(DbContextOptions<UserDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
}
