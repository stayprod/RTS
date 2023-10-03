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

namespace TriggerService
{

    public class Worker : BackgroundService
    {

        List<Client> clients = new List<Client>();
        Client cli = new Client();
        EmailSend SendEmailobj = new EmailSend();
        private readonly ILogger<Worker> _logger;
        private readonly HttpClient _httpClient;




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

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            try
            {
                while (!stoppingToken.IsCancellationRequested)
                {
                    var token = await GetTokenAsync();

                    // Get today's appointments
                    var appointments = await GetTodaysAppointmentsAsync(token);
                    using (var context = new EmailWorkerServiceContext())
                    {
                        var settings = context.Settings.ToList();
                        // Process the appointments as needed
                        foreach (var appointment in appointments.Calendars)
                        {
                            foreach (var setting in settings)
                            {
                                DateTime currentTime = DateTime.Now;
                                //DateTime otherTime = new DateTime(client.LastEmail);
                                int minutesDifference;
                                if (setting.EmailTime.DayOfYear == 1)
                                {
                                    TimeSpan timeDifferenceFromFirstmail = currentTime.Subtract(setting.EmailTime);
                                    minutesDifference = (int)timeDifferenceFromFirstmail.TotalMinutes;
                                }
                                else
                                {
                                    TimeSpan timeDifference = currentTime.Subtract(setting.EmailTime);
                                    minutesDifference = (int)timeDifference.TotalMinutes;
                                }
                                int emailRemindTime = setting.TimeAfterFirstSent * 24 * 60;


                                if (minutesDifference >= setting.TimeAfterEvent && setting.SentEmail == true && setting.EventTypeId == appointment.Action.Id && setting.EmailTime.DayOfYear == 1)
                                {
                                    if (appointment.Contacts != null)
                                    {
                                        bool isEmailSend = SendEmailobj.emailSend(appointment.Contacts[0].PrivateEmail, "TestService", setting.TemplEmail, true);

                                        if (isEmailSend)
                                        {
                                            Console.WriteLine(appointment.Contacts[0].PrivateEmail);
                                            setting.EmailTime = currentTime;
                                            context.SaveChanges();
                                        }
                                    }

                                }
                                else if (minutesDifference >= emailRemindTime && setting.SentEmailRemind == true && setting.EventTypeId == appointment.Action.Id)
                                {
                                    if (appointment.Contacts != null)
                                    {
                                        bool isEmailSend = SendEmailobj.emailSend(appointment.Contacts[0].PrivateEmail, "TestService", setting.RemindTempl, true);

                                        if (isEmailSend)
                                        {
                                            Console.WriteLine(appointment.Contacts[0].PrivateEmail);
                                            setting.EmailTime = currentTime;
                                            context.SaveChanges();
                                        }
                                    }

                                }

                            }
                        }

                    }

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
