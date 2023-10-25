using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using TriggerService;
using TriggerService.Models;

public class MandrillEmailService
{
    private readonly HttpClient httpClient = new HttpClient();
    MandrillApiKey mandrillAppSettings;
    public MandrillEmailService()
    {
        IConfigurationRoot configuration = new ConfigurationBuilder()
        .SetBasePath(Directory.GetCurrentDirectory())
        .AddJsonFile("appsettings.json")
        .Build();

        mandrillAppSettings = configuration.GetSection("MandrillSettings").Get<MandrillApiKey>();
    }

    public async Task<bool> SendEmailAsync(string toEmail, string subject, string message)
    {
        var mandrillApiUrl = mandrillAppSettings.ApiUrl;

        var emailContent = new
        {
            key = mandrillAppSettings.ApiKey, 
            message = new 
            {
                from_email = mandrillAppSettings.FromEmail,
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
            if (response.IsSuccessStatusCode)
            {
                // Email sent successfully
                return true;
            }
            else
            {
                // Email sending failed
                Worker.LogMessage($"Failed to send email through Mandrill. Status Code: {response.StatusCode}");
                return false;
            }
        }
        catch (HttpRequestException ex)
        {
            Worker.LogMessage($"Error while sending email through Mandrill: {ex.Message}");
            return false;
        }
    }
}
