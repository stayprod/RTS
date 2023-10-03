using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace TriggerService.Models
{
    public partial class Client
    {
        public int ClientId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public int Time { get; set; }
        public string Message { get; set; }
        public DateTime LastEmail { get; set; }
    }
}
