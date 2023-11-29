using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;

namespace realAdviceTriggerSystemService.Models
{
   public class EmailSetting
    {
        public string Host { get; set; }
        public int Port { get; set; }
        public string Username { get; set; }  
        public string Password { get; set; }
        public string CC { get; set; }
        public string BCC { get; set; }
    }
}
