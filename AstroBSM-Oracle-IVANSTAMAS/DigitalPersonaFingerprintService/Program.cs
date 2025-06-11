using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using System.Text;

// Add these using statements for DigitalPersona SDK
// using DigitalPersona.StandaloneSdk; // Uncomment and adjust based on your SDK version

var builder = WebApplication.CreateBuilder(args);

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors(); // Enable CORS globally

// Only start the fingerprint scan logic when /scan is called
app.MapGet("/scan", async context =>
{
    // --- DigitalPersona SDK fingerprint capture logic ---
    // Replace the following mock logic with actual SDK calls
    // Example pseudocode (replace with real SDK usage):
    // var scanner = new DigitalPersonaScanner();
    // byte[] template = scanner.CaptureTemplate();
    // For now, return a mock template
    byte[] template = Encoding.UTF8.GetBytes("mock_template");
    // --- End DigitalPersona SDK logic ---
    await context.Response.WriteAsync(Convert.ToBase64String(template));
});

app.Run("http://localhost:5001");
