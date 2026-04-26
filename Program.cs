using MultitenancyDemo.Core.Interfaces;
using MultitenancyDemo.Core.Settings;
using MultitenancyDemo.Infrastructure.Extensions;
using MultitenancyDemo.Infrastructure.Services;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Services
builder.Services.AddHttpContextAccessor();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

// Tenant
builder.Services.Configure<TenantSettings>(
    builder.Configuration.GetSection(nameof(TenantSettings)));

builder.Services.AddScoped<ITenantService, TenantService>();
builder.Services.AddTransient<IProductService, ProductService>();

// Registers DbContext + runs migrations per tenant on startup
builder.Services.AddAndMigrateTenantDatabases(builder.Configuration);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(); // → accessible sur /scalar/v1
}
app.UseHttpsRedirection();
app.MapControllers();
app.Run();