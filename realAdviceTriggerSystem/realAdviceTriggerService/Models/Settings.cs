using System;
using System.Collections.Generic;
using System.Text;

namespace TriggerService.Models
{
    public class Settings
    {
        public int SettingId { get; set; }
        public string KeyMoment { get; set; }
        public string TypeOfTransect { get; set; }
        public int EventTypeId { get; set; }
        public bool SentEmail { get; set; }
        public string TemplEmail { get; set; }
        public int TimeAfterEvent { get; set; }
        public bool SentEmailRemind { get; set; }
        public int TimeAfterFirstSent { get; set; }
        public int ClientId { get; set; }
        public string RemindTempl { get; set; }
        public bool SentSMS { get; set; }
        public string SMSTemplate { get; set; }
        public DateTime onEventCreated { get; set; }
        public DateTime EmailTime { get; set; }

        public bool SentRemindSMS { get; set; }
        public string RemindTemplate { get; set; }
    }

}
