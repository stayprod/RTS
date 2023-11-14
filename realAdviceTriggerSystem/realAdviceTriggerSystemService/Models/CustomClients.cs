using System;
using System.Collections.Generic;
using System.Text;

namespace realAdviceTriggerSystemService.Models
{
    public class CustomClients
    {
        public List<WhiseClients> clients { get; set; }
    }
    public class WhiseClients
    {
        public int Id { get; set; }
        public List<WhiseOffice> Offices { get; set; }
    }
    public class WhiseOffice
    {
        public int Id { get; set; } 
        public WhiseOfficeSettings OfficeSettings { get; set; }
    }
    public class WhiseOfficeSettings
    {
        public int Id { get; set; }
        public string appointmentType { get; set; }
        public string transactionType { get; set; }
        public string transactionStatus { get; set; }
        public string createdOn { get; set; }
        public string updatedOn { get; set; }
    }

}
