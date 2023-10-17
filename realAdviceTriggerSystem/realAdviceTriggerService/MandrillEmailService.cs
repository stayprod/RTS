using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using TriggerService.Models;

public class MandrillEmailService
{
   
    private readonly HttpClient httpClient = new HttpClient();

    public async Task SendEmailAsync(string toEmail, string subject, string message)
    {
        IConfigurationRoot configuration = new ConfigurationBuilder()
               .SetBasePath(Directory.GetCurrentDirectory())
               .AddJsonFile("appsettings.json")
               .Build();
        mandrillapikey mandrillApiKey = configuration.GetSection("mandrillapikey").Get<mandrillapikey>();
        var mandrillApiUrl = "https://mandrillapp.com/api/1.0/messages/send.json";

        var emailContent = new
        {
            key = mandrillApiKey.mandrillApiKey, 
            message = new 
            {
                from_email = "info@realadvice.be",
                to = new List<object>
                {
                    new
                    {
                        email = toEmail,
                        type = "to"
                    }
                },
                subject = subject,
                html = message
            }
        };

        try
        {
            var response = await httpClient.PostAsJsonAsync(mandrillApiUrl, emailContent);
            response.EnsureSuccessStatusCode();
        }
        catch (HttpRequestException ex)
        {
            Console.WriteLine($"Error sending email: {ex.Message}");
        }
    }
}
