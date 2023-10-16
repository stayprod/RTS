using System;
using System.Collections.Generic;
using System.Text;

namespace realAdviceTriggerSystemService.Models
{
    public class CustomClients
    {
        public List<clients> clients { get; set; }
    }
    public class clients
    {
        public int Id { get; set; }
        public List<Office> Offices { get; set; }
    }
    public class Office
    {
        public int Id { get; set; } 
        public OfficeSettings OfficeSettings { get; set; }
    }
    public class OfficeSettings
    {
        public int Id { get; set; }
        public string appointmentType { get; set; }
        public string transactionType { get; set; }
        public string transactionStatus { get; set; }
        public string createdOn { get; set; }
        public string updatedOn { get; set; }
    }

}
