using System;
using System.Collections.Generic;
using System.Text;

namespace TriggerService.Models
{
    class AppointmentDetail
    {
    }
    public class Action
    {
        public int Id { get; set; }
    }

    public class User
    {
        public int UserId { get; set; }
        public string DirectLine { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string Mobile { get; set; }
        public string Name { get; set; }
        public int OfficeId { get; set; }
    }

    public class ContactTitle
    {
        public int Id { get; set; }
    }

    public class Country
    {
        public int Id { get; set; }
    }

    public class Contact
    {
        public int ContactId { get; set; }
        public string Name { get; set; }
        public string FirstName { get; set; }
        public ContactTitle ContactTitle { get; set; }
        public Country Country { get; set; }
        public string LanguageId { get; set; }
        public string PrivateTel { get; set; }
        public string PrivateMobile { get; set; }
        public string PrivateEmail { get; set; }
        public bool AgreementEmail { get; set; }
        public bool AgreementSms { get; set; }
        public int FunnelStatusId { get; set; }
    }

    public class Calendar
    {
        public int Id { get; set; }
        public Action Action { get; set; }
        public DateTime StartDateTime { get; set; }
        public DateTime EndDateTime { get; set; }
        public string Subject { get; set; }
        public string Description1 { get; set; }
        public DateTime CreateDateTime { get; set; }
        public DateTime UpdateDateTime { get; set; }
        public List<User> Users { get; set; }
        public List<Contact> Contacts { get; set; }
    }

    public class AppointmentResponse
    {
        public List<Calendar> Calendars { get; set; }
        public int TotalCount { get; set; }
        public bool IsValidRequest { get; set; }
    }
}
