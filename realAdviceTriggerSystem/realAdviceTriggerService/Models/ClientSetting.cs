using System;
using System.Collections.Generic;
using System.Text;

namespace TriggerService.Models
{
   public class ClientSetting
    {
        public string ClientName { get; set; } 
        public string Password { get; set; }
    }

    public class MandrillApiKey
    {
        public string ApiKey { get; set; }
        public string ApiUrl { get; set; }
        public string FromEmail { get; set; }
    }
    public class AppGeneralSettings
    {
        public string LogFileName { get; set; }
        public string OccurrenceTimeInMinutes { get; set; }
    }
} 
