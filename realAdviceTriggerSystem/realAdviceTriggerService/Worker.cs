using TriggerService.Models;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using System.IO;
using realAdviceTriggerSystemService.Models;

namespace TriggerService
{
     
    public class Worker : BackgroundService
    {

        List<Clients> clients = new List<Clients>();
        Clients cli = new Clients();
        EmailSend SendEmailobj = new EmailSend();
        private readonly ILogger<Worker> _logger;
        private readonly HttpClient _httpClient;
        private readonly MandrillEmailService _emailService;

        public Worker(ILogger<Worker> logger)
        {
            _logger = logger;
            _httpClient = new HttpClient();
        }
        private async Task<string> GetTokenAsync()
        {
            try
            {
                IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();
                ClientSetting clientSettings = configuration.GetSection("ClientCredential").Get<ClientSetting>();
                // Prepare the request content
                var requestContent = new StringContent(
                            "{\"username\": \"" + clientSettings.ClientName + "\", \"password\": \"" + clientSettings.Password + "\"}",
                            Encoding.UTF8,
                            "application/json"
                        );

                // Send the POST request to obtain the token
                var response = await _httpClient.PostAsync("https://api.whise.eu/token", requestContent);

                // Ensure a successful response
                response.EnsureSuccessStatusCode();

                // Read the response content
                var responseContent = await response.Content.ReadAsStringAsync();

                // Extract the token from the response JSON
                var token = JObject.Parse(responseContent)["token"].ToString();

                return token;
            }
            catch (Exception)
            {

                throw;
            }
        }
        private async Task<AppointmentResponse> GetTodaysAppointmentsAsync(string token)
        {
            try
            {
                // Prepare the request headers
                _httpClient.DefaultRequestHeaders.Clear();
                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

                // Build the request URL
                var apiUrl = "https://api.whise.eu/v1/calendars/list";

                // Prepare the request content (JSON data)
                var today = DateTime.UtcNow.Date;
                var requestData = new { dateFrom = today, dateTo = today.AddDays(1) };
                var json = JsonConvert.SerializeObject(requestData);
                var requestContent = new StringContent(json, Encoding.UTF8, "application/json");

                // Send the POST request to retrieve today's appointments
                var response = await _httpClient.PostAsync(apiUrl, requestContent);

                // Ensure a successful response
                response.EnsureSuccessStatusCode();

                // Read the response content
                var responseContent = await response.Content.ReadAsStringAsync();

                // Deserialize the response JSON into a list of Appointment objects

                AppointmentResponse appointmentResponse = JsonConvert.DeserializeObject<AppointmentResponse>(responseContent);


                return appointmentResponse;
            }
            catch (Exception)
            {

                throw;
            }

        }


        private async Task<EstateResponse> GetEstateListAsync(string token)
        {
            try
            {
                // Prepare the request headers
                _httpClient.DefaultRequestHeaders.Clear();
                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

                // Build the request URL
                var apiUrl = "https://api.whise.eu/v1/estates/list";

                // Prepare the request content (JSON data)
                var today = DateTime.UtcNow.Date;
                var requestData = new { id="5284008" };
                var json = JsonConvert.SerializeObject(requestData);
                var requestContent = new StringContent(json, Encoding.UTF8, "application/json");

                // Send the POST request to retrieve Estate
                var response = await _httpClient.PostAsync(apiUrl, requestContent);

                // Ensure a successful response
                response.EnsureSuccessStatusCode();

                // Read the response content
                var responseContent = await response.Content.ReadAsStringAsync();

                // Deserialize the response JSON into a list of Estate objects

                EstateResponse EstateResponse = JsonConvert.DeserializeObject<EstateResponse>(responseContent);


                return EstateResponse;
            }
            catch (Exception)
            {

                throw;
            }

        }

        public async Task<object> GetTriggerAsync()
        {
            try
            {
                IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();
                ClientSetting clientSettings = configuration.GetSection("ClientCredential").Get<ClientSetting>();
                // Prepare the request content
                var requestContent = new StringContent(
                            "application/json"
                        );

                // Send the POST request to obtain the token
                var response = await _httpClient.GetAsync("https://localhost:7139/api/OfficeTrigger/GetAllTriggers");

                // Ensure a successful response
                //response.EnsureSuccessStatusCode();

                // Read the response content
                var responseContent = await response.Content.ReadAsStringAsync();

                // Extract the token from the response JSON
                //var token = JObject.Parse(responseContent)["token"].ToString();
                return responseContent;
            }
            catch (Exception)
            {

                throw;
            }
        }
        
        private async Task<OfficeTriggers> GetTriggers()
        {
            return new OfficeTriggers();
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            try
            {
                var token = await GetTokenAsync();
                while (!stoppingToken.IsCancellationRequested)
                {
                    //_emailService = new MandrillEmailService();
                    //var triggers = await GetTriggerAsync();
                    //await _emailService.SendEmailAsync("umarfarooq3540@email.com", "Subject", "Message body");


                    // Get today's appointmentss
                    Console.WriteLine(token);
                    var appointments = await GetTodaysAppointmentsAsync(token);
                    using (var context = new realadvicetriggeringsystemContext())
                    {
                        var _clients = context.Clients.ToList();
                    }
                    var EstateList = await GetEstateListAsync(token);
                    Console.WriteLine(appointments);

                }
                await Task.Delay(TimeSpan.FromSeconds(60), stoppingToken); // Poll API every 30 seconds 
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while retrieving data from API");
            }
        }

    }
}
