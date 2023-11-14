using System;
using System.Collections.Generic;
using System.Text;

namespace realAdviceTriggerSystemService.Models
{
    internal class clientResponce
    {
        
    }
    public class c_response
    {
        public clients_trigger clients_trigger { get; set; }
        public client_clients client_clients { get; set; }
    }
    public class clients_trigger
    {
        public int OfficeTriggerid { get; set; }
        public int? Officeid { get; set; }
        public int? Layoutid { get; set; }
        public string TriggerName { get; set; }
        public string KeyMoment { get; set; }
        public string TriggerType { get; set; }
        public string DurationType { get; set; }
        public int? DurationValue { get; set; }
        public string TargetParticipant1 { get; set; }
        public string CTarget1 { get; set; }
        public string TargetParticipant2 { get; set; }
        public string CTarget2 { get; set; }
        public string Language { get; set; }
        public string Texte { get; set; }
        public string appointment_type { get; set; }
        public string transaction_type { get; set; }
        public string transaction_status { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string UpdatedOn { get; set; }
    }
    public class client_clients
    {
        public int Clientid { get; set; }
        public int WhiseClientid { get; set; }
        public string ActivationStatus { get; set; }
        public string Logo { get; set; }
        public string CommercialName { get; set; }
        public string Street { get; set; }
        public string North { get; set; }
        public string BoxNumber { get; set; }
        public string ZipCode { get; set; }
        public string City { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Website { get; set; }
        public string Country { get; set; }
        public string CrmDetail { get; set; }
        public string Comments { get; set; }
    }
}
