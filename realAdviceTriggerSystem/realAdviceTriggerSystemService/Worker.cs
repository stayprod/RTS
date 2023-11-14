using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using realAdviceTriggerSystemService.Models;
using System.Net.Http.Headers;
using System.Text;
using System.Text.RegularExpressions;

namespace realAdviceTriggerSystemService
{
    public class Worker : BackgroundService
    {
        string prefrences = "all";
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
            new Country(1, "Belgium"),
            new Country(2, "Canada"),
            new Country(3, "United Kingdom"),
            new Country(4, "Australia"),
            new Country(5, "Germany")
        };
        string currentCountry = "";

        List<Client> clients = new List<Client>();
        Client cli = new Client();
        EmailSend SendEmailobj = new EmailSend();

        private readonly ILogger<Worker> _logger;
        private readonly HttpClient _httpClient;
        private MandrillEmailService _emailService;

        IConfigurationRoot configuration;
        public static AppGeneralSettings appGeneralSettings;

        public Worker(ILogger<Worker> logger)
        {
            _logger = logger;
            _httpClient = new HttpClient();

            configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            Worker.appGeneralSettings = configuration.GetSection("AppGeneralSettings").Get<AppGeneralSettings>();
        }
        private async Task<string> GetTokenAsync()
        {
            try
            {
                ClientSetting clientSettings = configuration.GetSection("WhiseClientCredential").Get<ClientSetting>();

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
            catch (Exception exp)
            {
                ExceptionsLog("Error while getting token from WHISE " + exp.Message);
                Worker.LogMessage("Error while getting token from WHISE " + exp.Message);
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
                DateTime dateTime = DateTime.Now; // Replace this with your desired date and time
                string formattedDateTime = dateTime.ToString("yyyy-MM-ddTHH:mm:ss");
                var data = new
                {
                    Filter = new
                    {
                        DateTimeRange = new
                        {
                            Min = appGeneralSettings.ServiceStartTime,
                            Max = formattedDateTime
                        }
                    }
                };
                string jsonData = JsonConvert.SerializeObject(data);
                var json = JsonConvert.SerializeObject(requestData);
                var requestContent = new StringContent(jsonData, Encoding.UTF8, "application/json");

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
            catch (Exception exp)
            {
                ExceptionsLog("Error while calling method GetTodaysAppointmentsAsync (whise) " + exp.Message);
                Worker.LogMessage("Error while calling method GetTodaysAppointmentsAsync (whise) " + exp.Message);
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
            catch (Exception exp)
            {
                ExceptionsLog("Error while calling method GetEstateListAsync (whise) " + exp.Message);
                Worker.LogMessage("Error while calling method GetEstateListAsync (whise) " + exp.Message);
                throw;
            }
        }


        private async Task<countryList> GetCountryList(string token)
        {
            try
            {
                // Prepare the request headers
                _httpClient.DefaultRequestHeaders.Clear();
                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

                // Build the request URL
                var apiUrl = "https://api.whise.eu/v1/estates/usedcountries/list";
                string requestBody = "{\"EstateFilter\": {\"WithRefDescriptions\": true}}";
                HttpContent requestContent = new StringContent(requestBody, Encoding.UTF8, "application/json");

                // Prepare the request content (JSON data)
                var today = DateTime.UtcNow.Date;
                var requestData = new
                {
                    EstateFilter = new
                    {
                        WithRefDescriptions = new[] { "true" }
                    }
                };
                var json = JsonConvert.SerializeObject(requestData);
                var requestContent1 = new StringContent(json, Encoding.UTF8, "application/json");

                // Send the POST request to retrieve Estate
                var response = await _httpClient.PostAsync(apiUrl, requestContent);

                // Ensure a successful response
                response.EnsureSuccessStatusCode();

                // Read the response content
                var responseContent = await response.Content.ReadAsStringAsync();

                // Deserialize the response JSON into a list of Estate objects

                countryList EstateResponse = JsonConvert.DeserializeObject<countryList>(responseContent);


                return EstateResponse;
            }
            catch (Exception exp)
            {
                ExceptionsLog("Error while calling method GetCountryListAsync (whise) " + exp.Message);
                Worker.LogMessage("Error while calling method GetCountryListAsync (whise) " + exp.Message);
                throw;
            }
        }
        public static void LogMessage(string message)
        {
            try
            {
                string filePath = appGeneralSettings.LogFileName;
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

        public static void ExceptionsLog(string message)
        {
            try
            {
                string filePath = appGeneralSettings.ExceptionLogFileName;
                using (StreamWriter writer = new StreamWriter(filePath, true))
                {
                    writer.WriteLine($"{DateTime.Now:yyyy-MM-dd HH:mm:ss} - {message}");
                }
            }
            catch (Exception ex)
            {
                // Handle exceptions or log them to another log file.
                Worker.LogMessage($"Error while writing to the log file: {ex.Message}");
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
                    CalenderActionId = appointmentObjID,
                    EstateId = appointmentObjEstateID
                };

                con.RtsEmailLogs.Add(t);
                con.SaveChanges();
            }

        }
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            try
            {
                var whiseToken = await GetTokenAsync();
                Worker.LogMessage(" RTS Service has been started ");
                _emailService = new MandrillEmailService();

                while (!stoppingToken.IsCancellationRequested)
                {
                    Worker.LogMessage("---------------------RTS Service processing is in iterations------------------");

                    //1 - you collect all calendar event
                    var appointments = await GetTodaysAppointmentsAsync(whiseToken);// for all clients
                    var EstateList = await GetEstateListAsync(whiseToken);
                    var countryList = await GetCountryList(whiseToken);
                    using (var con = new realadvicetriggeringsystemContext())
                    {
                        //con.OfficeSmtpsettings.Where(t => t.WhiseOfficeid == trigger.WhiseOfficeid)
                        List<Client> clients = con.Clients.ToList();
                        if (Worker.appGeneralSettings.TargetClientIds != null && clients.Count > 0)
                        {
                            clients = clients.Where(item => Worker.appGeneralSettings.TargetClientIds.Contains(item.WhiseClientid)).ToList();
                        }


                        List<AdminDetail> admindetails = con.AdminDetails.ToList();
                        List<Office> offices = con.Offices.ToList();
                        List<OfficeTrigger> triggers = con.OfficeTriggers.ToList();

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
                            if (triggerList.Count == 0)
                            {
                                continue;
                            }
                            // five options in list 
                            //1=pending
                            // 2=demo
                            // 3=activate
                            // 4=suspended
                            // 5=deactivate
                            if (clientObj.client.ActivationStatus != "5")// && clientObj.client.ActivationStatus != "deactivated")
                            {
                                Worker.LogMessage("Control passed from Activation Status(client(" + clientObj.client.WhiseClientid + "  " + clientObj.client.CommercialName + ") is not deactivated)");
                                foreach (var trigger in triggerList)
                                {
                                    //2 - For each calendar event you will start by looking to the estate related to this event

                                    foreach (var appointmentObj in appointments.Calendars)
                                    {
                                        // get trigger duration set for current appointment
                                        TimeSpan triggerSettingTimeSpan = CreateTimeSpan(trigger.DurationType, (int)trigger.DurationValue);
                                        // check here there must be a estate object , office id should be same and time period is passed of setting like 1hour,1 day etc
                                        //3-if estate associate => you collect the information about the office link to that estate
                                        //WITH THIS OFFICE ID you know now which trigger rules you need to follow
                                        // TriggerType == "1" mean email and 2 mean sms
                                        DateTime createdOn = appointmentObj.EndDateTime;
                                        DateTime appointmentTime = createdOn.AddHours(Worker.appGeneralSettings.TimeZoneDifferenceInHours);
                                        DateTime currentTime = DateTime.Now;
                                        TimeSpan timeDifference = currentTime - appointmentTime;
                                        if (appointmentObj.estates != null &&
                                            trigger.TriggerType == "1" && // 1 means email and 2 means sms
                                            trigger.TargetParticipant1 == "1" && // 1 means there are some partipents and 2 means no partipents
                                            trigger.WhiseOfficeid == appointmentObj.Users[0].OfficeId &&
                                            timeDifference >= triggerSettingTimeSpan)
                                        {
                                            Worker.LogMessage("control passed from condition of same whise office ids of both trigger settings and appointment onject.\n office id is : " + trigger.WhiseOfficeid + " and time durtion that is in min,hours or days");
                                            foreach (var estateListObj in EstateList.estates)
                                            {
                                                // point-2 condtion
                                                if (appointmentObj.estates[0].estateId == estateListObj.Id)
                                                {
                                                    //4-THEN back to the calendar event you look to the action ID and you compare if this actionid is mapped to any of the triggers of this office
                                                    // here action id is AppointmentType
                                                    //5-THEN you will check if there is condition related to the estate transaction type and or transaction status
                                                    if (appointmentObj.Contacts == null)
                                                    {
                                                        string emailbody = $"<h2>Error</h2><br><p>There is no contact exist <strong>against this userID {appointmentObj.Users[0].UserId} userName {appointmentObj.Users[0].FirstName} Email {appointmentObj.Users[0].Email} </strong></p>";
                                                        //if no contact then you send a error message to the user's email
                                                        bool response = await _emailService.SendEmailAsync(appointmentObj.Users[0].Email, "error", emailbody);
                                                        if (response)
                                                        {
                                                            LogMessage("error email send successfully from mandrill to " + appointmentObj.Users[0].Email + "because no contact email found.\n Whise client id is:" + trigger.WhiseClientid + "whsie office id is :" + trigger.WhiseOfficeid);
                                                        }
                                                    }
                                                    if (appointmentObj.Action.Id == int.Parse(trigger.AppointmentType) &&
                                                        ((string.IsNullOrEmpty(trigger.TransactionType) || !int.TryParse(trigger.TransactionType, out _)) ||
                                                        estateListObj.purpose.Id == int.Parse(trigger.TransactionType)) &&
                                                        ((string.IsNullOrEmpty(trigger.TransactionType) || !int.TryParse(trigger.TransactionType, out _)) ||
                                                        estateListObj.purpose.Id == int.Parse(trigger.TransactionType)))
                                                    {
                                                        Worker.LogMessage("control pass from Transaction checks with whise office id :" + trigger.WhiseOfficeid + "and whsie client id" + trigger.WhiseClientid);
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
                                                            Layout layout = con.Layouts.Where(t => t.Layoutid == trigger.Layoutid).FirstOrDefault();

                                                            // survey link
                                                            string link = trigger.SurveyLink;
                                                            // Dictionary to store placeholder replacements
                                                            //Country cntry = countries.FirstOrDefault(c => c.Id == contact.Country.Id);
                                                            foreach (var ccountry in countryList.countries)
                                                            {
                                                                if (ccountry.Id == contact.Country.Id)
                                                                {
                                                                    currentCountry = ccountry.Name; break;
                                                                }
                                                            }
                                                            Dictionary<string, string> replacements = new Dictionary<string, string>
                                                            {
                                                                { "firstName", (contact.FirstName==null)?"":contact.FirstName },
                                                                { "name", (contact.Name==null)?"":contact.Name },
                                                                { "language", (contact.LanguageId==null)?"" : contact.LanguageId},
                                                                { "email", toEmail},
                                                                { "agent", $"{appointmentObj.Users[0].UserId}"},
                                                                { "zip", $"{contact.zip}"},
                                                                { "officeid",$"{appointmentObj.estates[0].officeId}"},
                                                                { "country",$"{currentCountry}"},
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
                                                            string subject = "";

                                                            switch (contact.LanguageId)
                                                            {
                                                                case "fr-BE":
                                                                    etext = trigger.TexteFrench;
                                                                    subject = trigger.FrenchSubject;
                                                                    break;
                                                                case "en-GB":
                                                                    etext = trigger.TexteEnglish;
                                                                    subject = trigger.EnglishSubject;
                                                                    break;
                                                                case "nl-BE":
                                                                    etext = trigger.TexteDutch;
                                                                    subject = trigger.DutchSubject;
                                                                    break;
                                                            }
                                                            //string url = "<a href=" + outputString + " >" + outputString + "</a>";
                                                            StringBuilder htmlBuilder = new StringBuilder();
                                                            for (int i = 1; i <= 10; i++)
                                                            {
                                                                htmlBuilder.Append($"<a href=\"{outputString}\"><button>{i}</button></a>");
                                                            }
                                                            prefrences = trigger.ContactPreference;
                                                            Dictionary<string, string> emailBodyLayout = new Dictionary<string, string>
                                                            {
                                                                { "name", (contact.FirstName == null) ? contact.Name : contact.FirstName },
                                                                { "texte", etext},
                                                                { "link", Convert.ToString(htmlBuilder)},
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
                                                            var logdetailsforcurrentClientOffice = con.RtsEmailLogs.Where(l => l.CalenderActionId == appointmentObj.Id && l.ContactId == contact.ContactId).FirstOrDefault();
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
                                                                                bool isEmailSend = SendEmailobj.emailSend(contact.PrivateEmail, subject, emailbody, smtp_settings, true);
                                                                                if (isEmailSend)
                                                                                {
                                                                                    insertLog(trigger.OfficeTriggerid, contact.PrivateEmail, (int)trigger.WhiseOfficeid, (int)trigger.WhiseClientid, contact.ContactId, appointmentObj.Id, appointmentObj.estates[0].estateId);

                                                                                    Worker.LogMessage("email send successfully using private email to " + contact.PrivateEmail);
                                                                                }

                                                                            }
                                                                            if (contact.businessEmail != null)
                                                                            {
                                                                                bool isSecondEmailSend = SendEmailobj.emailSend(contact.businessEmail, subject, emailbody, smtp_settings, true);
                                                                                if (isSecondEmailSend)
                                                                                {
                                                                                    insertLog(trigger.OfficeTriggerid, contact.businessEmail, (int)trigger.WhiseOfficeid, (int)trigger.WhiseClientid, contact.ContactId, appointmentObj.Id, appointmentObj.estates[0].estateId);

                                                                                    Worker.LogMessage("email send successfully to " + contact.businessEmail);
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
                                                                        bool isEmailSend = SendEmailobj.emailSend(recipientEmail, subject, emailbody, smtp_settings, true);
                                                                        if (isEmailSend)
                                                                        {
                                                                            insertLog(trigger.OfficeTriggerid, recipientEmail, (int)trigger.WhiseOfficeid, (int)trigger.WhiseClientid, contact.ContactId, appointmentObj.Id, appointmentObj.estates[0].estateId);

                                                                            Worker.LogMessage("email send successfully to " + recipientEmail);
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
                                                                            if (!string.IsNullOrEmpty(contact.PrivateEmail))
                                                                            {
                                                                                bool response = await _emailService.SendEmailAsync(contact.PrivateEmail, subject, emailbody);
                                                                                if (response)
                                                                                {
                                                                                    insertLog(trigger.OfficeTriggerid, contact.PrivateEmail, (int)trigger.WhiseOfficeid, (int)trigger.WhiseClientid, contact.ContactId, appointmentObj.Id, appointmentObj.estates[0].estateId);
                                                                                    Worker.LogMessage("email send successfully from mandrill using private email to " + contact.PrivateEmail);
                                                                                }
                                                                            }
                                                                            if (!string.IsNullOrEmpty(contact.businessEmail))
                                                                            {
                                                                                bool secondresponse = await _emailService.SendEmailAsync(contact.businessEmail, subject, emailbody);
                                                                                if (secondresponse)
                                                                                {
                                                                                    insertLog(trigger.OfficeTriggerid, contact.businessEmail, (int)trigger.WhiseOfficeid, (int)trigger.WhiseClientid, contact.ContactId, appointmentObj.Id, appointmentObj.estates[0].estateId);
                                                                                    Worker.LogMessage("email send successfully from mandrill using business email to  " + contact.businessEmail);
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

                                                                    if (prefrences != "all" && !string.IsNullOrEmpty(recipientEmail))
                                                                    {
                                                                        // Send the email based on the selected option
                                                                        bool response = await _emailService.SendEmailAsync(recipientEmail, subject, emailbody);
                                                                        if (response)
                                                                        {
                                                                            insertLog(trigger.OfficeTriggerid, recipientEmail, (int)trigger.WhiseOfficeid, (int)trigger.WhiseClientid, contact.ContactId, appointmentObj.Id, appointmentObj.estates[0].estateId);
                                                                            Worker.LogMessage("Email send successfully from mandrill to " + recipientEmail);
                                                                        }
                                                                    }
                                                                    else if (prefrences != "all")
                                                                    {
                                                                        Worker.LogMessage($"Client( {clientObj.client.CommercialName}) prefrence email does not exist whise client id is : {trigger.WhiseClientid} whise office id is :{trigger.WhiseOfficeid}");
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                    else
                                                    {
                                                        Worker.LogMessage($"Client({clientObj.client.CommercialName}) control cannot pass from Transaction checks and its whise client id is : {trigger.WhiseClientid} whise office id is :{trigger.WhiseOfficeid}");
                                                    }
                                                }

                                            }
                                        }
                                        else
                                        {
                                            Worker.LogMessage("control cannot passed from condition of same whise office ids of both trigger settings and appointment object.\n office id is : " + trigger.WhiseOfficeid + " and time durtion that is in min, hours or days");
                                        }
                                    }
                                }
                            }
                            else
                            {
                                Worker.LogMessage("Client(" + clientObj.client.CommercialName + ") status is deactivated");
                            }
                        }
                    }


                    //_logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);
                    await Task.Delay(TimeSpan.FromMinutes(Convert.ToDouble(Worker.appGeneralSettings.OccurrenceTimeInMinutes)), stoppingToken); // Append every 60 seconds
                }
            }
            catch (Exception ex)
            {
                ExceptionsLog("An error occurred while retrieving data from API" + ex);
                _logger.LogError(ex, "An error occurred while retrieving data from API");
            }
        }
    }
}