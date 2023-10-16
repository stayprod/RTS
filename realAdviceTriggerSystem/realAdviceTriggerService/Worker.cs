using TriggerService.Models;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using System.IO;
using realAdviceTriggerSystemService.Models;
using System.Runtime.Intrinsics.X86;
using static System.Net.Mime.MediaTypeNames;
//using Newtonsoft.Json;
//using JSON.Net;

namespace TriggerService
{

    public class Worker : BackgroundService
    {
        public enum status
        {
        }
        // Your JSON data
        string jsonData = @"[{
                clients:[{
                ""id"":12345
              offices:[{
                ""id"":13489
              ""OfficeSettings"":{
              ""officeTriggerid"": 1,
              ""officeid"": 1,
              ""layoutid"": 1,
              ""triggerName"": ""Trigger: Evaluation (to sale) Email Days (1) Buyer  "",
              ""keyMoment"": ""1"",
              ""triggerType"": ""1"",
              ""durationType"": ""1"",
              ""durationValue"": 1,
              ""targetParticipant1"": ""1"",
              ""targetParticipant2"": """",
              ""cTarget2"": """",
              ""language"": ""english"",
              ""texte"": """",
              ""createdOn"": ""2023-10-06T11:35:27"",
              ""updatedOn"": ""2023-10-06T11:35:26.980707"",
              ""appointmentType"": ""131243"",
              ""transactionType"": ""1"",
              ""transactionStatus"": ""15""
        }  ]  
}]
}]";
        //enum timespan
        //{
        //    1 = "{value}, 0, 0, 0",
        //    2 = "0,{value},0,0",
        //    3 = "0,0,{value},0"
        //}
        static TimeSpan CreateTimeSpan(string flag, int value)
        {
            switch (flag)
            {
                case "1":
                    return new TimeSpan(value, 0, 0, 0);
                case "2":
                    return new TimeSpan(0, value, 0, 0);
                case "3":
                    return new TimeSpan(0, 0, value, 0);
                default:
                    throw new ArgumentException("Invalid flag");
            }
        }
        enum transactionStatusManu
        {
            toSale = 1,
            toRent = 2,
            sold = 3,
            rented = 4,
            underOptionSale = 5,
            UnderOptionRent = 6,
            RetiréDeLaVente = 8,
            RetiréDeLaLocation = 9,
            suspenduVendu = 10,
            suspenduLoué = 11,
            OptionPropVendu = 12,
            OptionPropLoué = 13,
            VenduAvecCondSuspensive = 14,
            AVendreEnViager = 15,
            SousOptionEnViager = 16,
            VenduEnViager = 17,
            Prospection = 19,
            préparationVente = 20,
            Réservé = 21,
            Compromis = 22,
            ProspectionLocation = 23,
            EstimationVente = 24,
            EstimationLocation = 25,
            EstimationRenteViagère = 26,
            PréparationLocation = 27,
            PréparationVenteEnViager = 28,
        }
        string appointmentType = "131243",
              transactionType = "1",
              transactionStatus = "1";

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
                var requestData = new
                {

                };
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
                var requestData = new { id = "5284008" };
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
                var whiseToken = await GetTokenAsync();

                //string y = null;
                //var x = y;
                while (!stoppingToken.IsCancellationRequested)
                {
                    //_emailService = new MandrillEmailService();
                    //var triggers = await GetTriggerAsync();
                    //await _emailService.SendEmailAsync("umarfarooq3540@email.com", "Subject", "Message body");
                    // Get today's appointmentss
                    //var clientsDetails = GetAllClientsDetail();

                    //var list = JsonConvert.DeserializeObject<List<MyItem>>(json);

                    //var jsonData = JsonConvert.DeserializeObject<dynamic>(JsonConvert.SerializeObject(clientsDetails));
                    var appointments = await GetTodaysAppointmentsAsync(whiseToken);// for all clients
                    var EstateList = await GetEstateListAsync(whiseToken);
                    string filePath = "output.txt";
                    using (var con = new realadvicetriggeringsystemContext())
                    {
                        List<Clients> clients = con.Clients.ToList();
                        List<AdminDetail> admindetails = con.AdminDetail.ToList();
                        List<Offices> offices = con.Offices.ToList();
                        List<OfficeTriggers> triggers = con.OfficeTriggers.ToList();

                        var _clients = from c in clients
                                       join ad in admindetails on c.Clientid equals ad.Clientid into cl_ad
                                       join o in offices on c.Clientid equals o.Clientid
                                       join t in triggers on o.Officeid equals t.Officeid into off_triggers
                                       select (new
                                       {
                                           client = c,
                                           admin = cl_ad,
                                           triggers = off_triggers
                                       });

                        var result = _clients.ToList();
                        foreach (var clientObj in result)
                        {
                            var triggerList = clientObj.triggers.ToList();
                            if (clientObj.client.ActivationStatus != "suspended" && clientObj.client.ActivationStatus != "deactivated")
                            {

                                foreach (var trigger in triggerList)
                                {

                                    foreach (var appointmentObj in appointments.Calendars)
                                    {
                                        TimeSpan timeSpan1 = CreateTimeSpan(trigger.DurationType, trigger.DurationValue);
                                        // check here there must be a estate object , office id should be same and time period is passed of setting like 1hour,1 day etc
                                        if (appointmentObj.estates != null &&
                                            trigger.WhiseOfficeid == appointmentObj.Users[0].OfficeId &&
                                            Convert.ToDateTime(trigger.CreatedOn) + timeSpan1 > appointmentObj.CreateDateTime)
                                        {
                                            foreach (var estateListObj in EstateList.estates)
                                            {
                                                if (appointmentObj.estates[0].estateId == estateListObj.Id)
                                                {
                                                    if (estateListObj.purpose.Id == int.Parse(trigger.TransactionType) &&
                                                        estateListObj.purposeStatus.Id == int.Parse(trigger.TransactionStatus) &&
                                                        appointmentObj.Action.Id == int.Parse(trigger.AppointmentType) &&
                                                        appointmentObj.Contacts != null)
                                                    {
                                                        foreach (var contact in appointmentObj.Contacts)
                                                        {
                                                            using (StreamWriter writer = new StreamWriter(filePath, true))
                                                            {
                                                                if (contact.PrivateEmail != null)
                                                                {

                                                                    var t = new RtsEmailLog //Make sure you have a table called test in DB
                                                                    {
                                                                        OfficeTriggerid = trigger.OfficeTriggerid,
                                                                        Email = contact.PrivateEmail,
                                                                        WhiseClientid = trigger.WhiseClientid,
                                                                        WhiseOfficeid = trigger.WhiseOfficeid

                                                                    };

                                                                    con.RtsEmailLog.Add(t);
                                                                    con.SaveChanges();
                                                                    writer.WriteLine("email sent successfully to " + contact.PrivateEmail);

                                                                }
                                                                else
                                                                {
                                                                    writer.WriteLine("email sent successfully to " + contact.businessEmail);

                                                                }

                                                            }
                                                        }

                                                    }
                                                    //if (appointmentObj.Action.Id ==)
                                                    using (StreamWriter writer = new StreamWriter(filePath, true))
                                                    {
                                                        writer.WriteLine("This text will be appended to the existing file.");
                                                    }
                                                }

                                            }
                                        }

                                    }


                                }

                            }
                        }

                    }



                    //bool isEmailSend = SendEmailobj.emailSend("umarfarooq3540@gmail.com", "Sunject", "<h2>My First Email </h2>", true);
                    //if (isEmailSend)
                    //{
                    //        using (StreamWriter writer = new StreamWriter(filePath, true))
                    //        {
                    //            writer.WriteLine("This text will be appended to the existing file.");
                    //        }
                    //}


                    //_logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);
                    await Task.Delay(TimeSpan.FromMinutes(2), stoppingToken); // Append every 60 seconds
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while retrieving data from API");
            }
        }

    }
}
