using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

public class MandrillEmailService
{
    private readonly string mandrillApiKey = "T---n8-XRHKa-iwnYU0pmg";
    private readonly HttpClient httpClient = new HttpClient();

    public async Task SendEmailAsync(string toEmail, string subject, string message)
    {
        var mandrillApiUrl = "https://mandrillapp.com/api/1.0/messages/send.json";

        var emailContent = new
        {
            key = mandrillApiKey,
            message = new 
            {
                from_email = "info@realadvice.be",
                to = new List<object>
                {
                    new
                    {
                        email = "umarfarooq3540@gmail.com",
                        name = "farooq",
                        type = "to"
                    }
                },
                subject = subject,
                text = message
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
