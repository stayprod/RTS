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
using System.Diagnostics;
using System.Security.Policy;
using System.Text.RegularExpressions;
using Microsoft.CodeAnalysis.Operations;
using System.Collections;
using static TriggerService.Worker;
//using Newtonsoft.Json;
//using JSON.Net;

namespace TriggerService
{
    public class Worker : BackgroundService
    {
        string prefrences = "all";
        // Your JSON data
        string englishTemplate = "<h2>Hello {0}</h2><br> <a href={1}>{1}</a>";
        string frenchTemplate = "<h2>Bonjour {name}</h2><br><h2>{link}</h2>";
        string germanTemplate = "<h2>Hello {name}</h2><br><h2>{link}</h2>";
        string baseUrl = "https://survey.realadvice.be/";
        bool smtpflage = true;
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
        public class Country
        {
            public int Id { get; set; }
            public string Name { get; set; }

            public Country(int id, string name)
            {
                Id = id;
                Name = name;
            }
        }
        List<Country> countries = new List<Country>
        {
            new Country(1, "United States"),
            new Country(2, "Canada"),
            new Country(3, "United Kingdom"),
            new Country(4, "Australia"),
            new Country(5, "Germany")
        };


        List<Clients> clients = new List<Clients>();
        Clients cli = new Clients();
        EmailSend SendEmailobj = new EmailSend();
        private readonly ILogger<Worker> _logger;
        private readonly HttpClient _httpClient;
        private MandrillEmailService _emailService;

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
                var requestData = new { };
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

                return responseContent;
            }
            catch (Exception)
            {

                throw;
            }
        }
        public static void LogMessage(string message)
        {
            try
            {
                string filePath = "output.txt";
                using (StreamWriter writer = new StreamWriter(filePath, true))
                {
                    writer.WriteLine($"{DateTime.Now:yyyy-MM-dd HH:mm:ss} - {message}");
                }
            }
            catch (Exception ex)
            {
                // Handle exceptions or log them to another log file.
                Console.WriteLine($"Error while writing to the log file: {ex.Message}");
            }
        }
        public static void insertLog(int OffTriggerid, string toEmail, int WhiseOffid, int WhiseClntid, int ContId, int appointmentObjID, int appointmentObjEstateID)
        {
            using (var con = new realadvicetriggeringsystemContext())
            {
                var t = new RtsEmailLog //Make sure you have a table called test in DB
                {
                    OfficeTriggerid = OffTriggerid,
                    Email = toEmail,
                    WhiseOfficeid = WhiseOffid,
                    WhiseClientid = WhiseClntid,
                    ContactId = ContId,
                    CalenderActonId = appointmentObjID,
                    EstateId = appointmentObjEstateID
                };

                con.RtsEmailLog.Add(t);
                con.SaveChanges();
            }

        }
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            try
            {
                var whiseToken = await GetTokenAsync();

                while (!stoppingToken.IsCancellationRequested)
                {
                    _emailService = new MandrillEmailService();
                    //1 - you collect all calendar event
                    var appointments = await GetTodaysAppointmentsAsync(whiseToken);// for all clients
                    var EstateList = await GetEstateListAsync(whiseToken);
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
                                           triggers = off_triggers,
                                       });

                        var result = _clients.ToList();
                        foreach (var clientObj in result)
                        {
                            var triggerList = clientObj.triggers.ToList();
                            if (clientObj.client.ActivationStatus != "suspended" && clientObj.client.ActivationStatus != "deactivated")
                            {
                                LogMessage("Control pass from ActivationStatus");
                                foreach (var trigger in triggerList)
                                {
                                    //2 - For each calendar event you will start by looking to the estate related to this event

                                    foreach (var appointmentObj in appointments.Calendars)
                                    {
                                        // get trigger duration set for current appointment
                                        TimeSpan timeSpan1 = CreateTimeSpan(trigger.DurationType, (int)trigger.DurationValue);
                                        // check here there must be a estate object , office id should be same and time period is passed of setting like 1hour,1 day etc
                                        //3-if estate associate => you collect the information about the office link to that estate
                                        //WITH THIS OFFICE ID you know now which trigger rules you need to follow
                                        if (appointmentObj.estates != null &&
                                            trigger.TriggerType == "1" &&
                                            trigger.WhiseOfficeid == appointmentObj.Users[0].OfficeId &&
                                            Convert.ToDateTime(trigger.CreatedOn) + timeSpan1 > appointmentObj.CreateDateTime)
                                        {
                                            LogMessage("control pass from same office id and time check");
                                            foreach (var estateListObj in EstateList.estates)
                                            {
                                                // point-2 condtion
                                                if (appointmentObj.estates[0].estateId == estateListObj.Id)
                                                {
                                                    //4-THEN back to the calendar event you look to the action ID and you compare if this actionid is mapped to any of the triggers of this office
                                                    // here action id is AppointmentType
                                                    //5-THEN you will check if there is condition related to the estate transaction type and or transaction status
                                                    if (appointmentObj.Action.Id == int.Parse(trigger.AppointmentType) &&
                                                        estateListObj.purpose.Id == int.Parse(trigger.TransactionType) &&
                                                        estateListObj.purposeStatus.Id == int.Parse(trigger.TransactionStatus) &&
                                                        appointmentObj.Contacts != null)
                                                    {

                                                        LogMessage("control pass from Transaction checks");
                                                        foreach (var contact in appointmentObj.Contacts)
                                                        {
                                                            var toEmail = "";
                                                            if (contact.PrivateEmail != null)
                                                            {
                                                                toEmail = contact.PrivateEmail;
                                                            }
                                                            else
                                                            {
                                                                toEmail = contact.businessEmail;
                                                            }

                                                            var smtp_settings = con.OfficeSmtpsettings.Where(t => t.WhiseOfficeid == trigger.WhiseOfficeid).FirstOrDefault();
                                                            var office_settings = con.Offices.Where(t => t.WhiseOfficeid == trigger.WhiseOfficeid).FirstOrDefault();
                                                            Layouts layout = con.Layouts.Where(t => t.Layoutid == trigger.Layoutid).FirstOrDefault();

                                                            // survey link
                                                            string link = trigger.SurveyLink;
                                                            // Dictionary to store placeholder replacements
                                                            Country cntry = countries.FirstOrDefault(c => c.Id == contact.Country.Id);
                                                            Dictionary<string, string> replacements = new Dictionary<string, string>
                                                            {
                                                                { "firstName", (contact.FirstName==null)?"":contact.FirstName },
                                                                { "name", (contact.Name==null)?"":contact.Name },
                                                                { "language", (contact.LanguageId==null)?"" : contact.LanguageId},
                                                                { "email", toEmail},
                                                                { "agent", $"{appointmentObj.Users[0].UserId}"},
                                                                { "zip", $"{contact.zip}"},
                                                                { "officeid",$"{appointmentObj.estates[0].officeId}"},
                                                                { "country",$"{cntry}"},
                                                                { "loginofficeid",$"{appointmentObj.Users[0].UserId}"},
                                                                { "contactid",$"{contact.ContactId}"},
                                                                { "lessorestimation","1"},
                                                                { "npssatisfication","0"},
                                                            }; 
                                                          
                                                            string pattern = @"\{([^}]+)\}";
                                                            ////////////////
                                                            string outputString = Regex.Replace(link, pattern, match =>
                                                            {
                                                                string key = match.Groups[1].Value;
                                                                if (replacements.TryGetValue(key, out string replacement))
                                                                {
                                                                    return replacement;
                                                                }
                                                                // If no replacement is found, keep the original placeholder
                                                                return match.Value;
                                                            });
                                                       
                                                            string etext = "";
                                                            switch (contact.LanguageId)
                                                            {
                                                                case "fr-BE":
                                                                    etext = trigger.TexteFrench;
                                                                    break;
                                                                case "en-GB":
                                                                    etext = trigger.TexteEnglish;
                                                                    break;
                                                                case "nl-de":
                                                                    etext = trigger.TexteDutch;
                                                                    break;
                                                            }
                                                            prefrences = trigger.ContactPreference;
                                                            Dictionary<string, string> emailBodyLayout = new Dictionary<string, string>
                                                            {
                                                                { "name", (contact.FirstName == null) ? "" : contact.FirstName },
                                                                { "texte", etext},
                                                                { "link", outputString },
                                                                { "signature", "signature"},
                                                            };
                                                            string layoutAfterAddingPlaceholders = Regex.Replace(layout.LayoutDetail, pattern, match =>
                                                            {
                                                                string key = match.Groups[1].Value;
                                                                if (emailBodyLayout.TryGetValue(key, out string replacement))
                                                                {
                                                                    return replacement;
                                                                }
                                                                // If no replacement is found, keep the original placeholder
                                                                return match.Value;
                                                            });
                                                            var logdetailsforcurrentClientOffice = con.RtsEmailLog.Where(l => l.CalenderActonId == appointmentObj.Id && l.ContactId == contact.ContactId).FirstOrDefault();
                                                            //string emailbody = string.Format(etext, contact.FirstName, outputString);
                                                            string emailbody = layoutAfterAddingPlaceholders;
                                                            if (logdetailsforcurrentClientOffice == null)
                                                            {

                                                                if (office_settings != null && office_settings.SmtpSettingid == 1)
                                                                {
                                                                    smtpflage = true;
                                                                }
                                                                else
                                                                {
                                                                    smtpflage = false;
                                                                }

                                                                if (smtpflage is true)
                                                                {
                                                                    string recipientEmail = "";

                                                                    switch (prefrences)
                                                                    {
                                                                        case "all":
                                                                            // Send to both private and business email
                                                                            if (contact.PrivateEmail != null)
                                                                            {
                                                                                bool isEmailSend = SendEmailobj.emailSend(contact.PrivateEmail, "Subject", emailbody, smtp_settings, true);
                                                                                if (isEmailSend)
                                                                                {
                                                                                    insertLog(trigger.OfficeTriggerid, contact.PrivateEmail, (int)trigger.WhiseOfficeid, (int)trigger.WhiseClientid, contact.ContactId, appointmentObj.Id, appointmentObj.estates[0].estateId);

                                                                                    LogMessage("email send successfully using private email to " + contact.PrivateEmail);
                                                                                }

                                                                            }
                                                                            if (contact.businessEmail != null)
                                                                            {
                                                                                bool isSecondEmailSend = SendEmailobj.emailSend(contact.businessEmail, "Subject", emailbody, smtp_settings, true);
                                                                                if (isSecondEmailSend)
                                                                                {
                                                                                    insertLog(trigger.OfficeTriggerid, contact.businessEmail, (int)trigger.WhiseOfficeid, (int)trigger.WhiseClientid, contact.ContactId, appointmentObj.Id, appointmentObj.estates[0].estateId);

                                                                                    LogMessage("email send successfully to " + contact.businessEmail);
                                                                                }
                                                                            }
                                                                            break;
                                                                        case "private":
                                                                            recipientEmail = contact.PrivateEmail;
                                                                            break;
                                                                        case "business":
                                                                            recipientEmail = contact.businessEmail;
                                                                            break;
                                                                        default:
                                                                            Console.WriteLine("Invalid choice.");
                                                                            return;
                                                                    }

                                                                    if (prefrences != "all")
                                                                    {
                                                                        // Send the email based on the selected option
                                                                        bool isEmailSend = SendEmailobj.emailSend(recipientEmail, "Subject", emailbody, smtp_settings, true);
                                                                        if (isEmailSend)
                                                                        {
                                                                            insertLog(trigger.OfficeTriggerid, recipientEmail, (int)trigger.WhiseOfficeid, (int)trigger.WhiseClientid, contact.ContactId, appointmentObj.Id, appointmentObj.estates[0].estateId);

                                                                            LogMessage("email send successfully to " + recipientEmail);
                                                                        }
                                                                    }

                                                                }
                                                                else
                                                                {
                                                                    //send  email through mandrill 
                                                                    string recipientEmail = "";

                                                                    switch (prefrences)
                                                                    {
                                                                        case "all":
                                                                            // Send to both private and business email
                                                                            await _emailService.SendEmailAsync(contact.PrivateEmail, "Subject", emailbody);
                                                                            insertLog(trigger.OfficeTriggerid, contact.PrivateEmail, (int)trigger.WhiseOfficeid, (int)trigger.WhiseClientid, contact.ContactId, appointmentObj.Id, appointmentObj.estates[0].estateId);
                                                                            LogMessage("email send successfully from mandrill using private email to " + contact.PrivateEmail);
                                                                            await _emailService.SendEmailAsync(contact.businessEmail, "Subject", emailbody);
                                                                            insertLog(trigger.OfficeTriggerid, contact.businessEmail, (int)trigger.WhiseOfficeid, (int)trigger.WhiseClientid, contact.ContactId, appointmentObj.Id, appointmentObj.estates[0].estateId);
                                                                            LogMessage("email send successfully from mandrill using business email to  " + contact.businessEmail);
                                                                            break;
                                                                        case "private":
                                                                            recipientEmail = contact.PrivateEmail;
                                                                            break;
                                                                        case "business":
                                                                            recipientEmail = contact.businessEmail;
                                                                            break;
                                                                        default:
                                                                            Console.WriteLine("Invalid choice.");
                                                                            return;
                                                                    }

                                                                    if (prefrences != "all")
                                                                    {
                                                                        // Send the email based on the selected option
                                                                        //await _emailService.SendEmailAsync(toEmail, "Subject", emailbody);
                                                                        insertLog(trigger.OfficeTriggerid, recipientEmail, (int)trigger.WhiseOfficeid, (int)trigger.WhiseClientid, contact.ContactId, appointmentObj.Id, appointmentObj.estates[0].estateId);
                                                                        LogMessage("email send successfully from mandrill to " + toEmail);
                                                                    }
                                                                }


                                                            }

                                                        }

                                                    }
                                                    else
                                                    {
                                                        string emailbody = $"<h2>Error</h2><br><p>There is no contact exist <strong>against this userID {appointmentObj.Users[0].UserId} userName {appointmentObj.Users[0].FirstName} Email {appointmentObj.Users[0].Email} </strong></p>";
                                                        //if no contact then you send a error message to the user's email
                                                        await _emailService.SendEmailAsync(appointmentObj.Users[0].Email, "Subject", emailbody);
                                                        LogMessage("error email send successfully from mandrill to " + appointmentObj.Users[0].Email);
                                                    }
                                                }

                                            }
                                        }

                                    }


                                }

                            }
                        }



                    }



               


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
