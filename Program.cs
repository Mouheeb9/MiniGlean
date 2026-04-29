using MultitenancyDemo.Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using MultitenancyDemo.Infrastructure.Extensions;
using MultitenancyDemo.Infrastructure.Services;
using MultitenancyDemo.Infrastructure.Persistence;
using Scalar.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Services
builder.Services.AddHttpContextAccessor();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["AppSettings:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["AppSettings:Audience"],
            ValidateLifetime = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["AppSettings:Token"]!)),
            ValidateActor = true,
        };
    });

// Tenant
builder.Services.AddScoped<ITenantService, TenantService>();
builder.Services.AddTransient<IDocumentService, DocumentService>();
builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddDbContext<UserDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("OurUsers")));

// Registers DbContext + runs migrations per tenant on startup
builder.Services.AddAndMigrateTenantDatabases(builder.Configuration);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(); // → accessible sur /scalar/v1
}
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
