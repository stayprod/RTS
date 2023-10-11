using System;
using System.Collections.Generic;

namespace realAdviceTriggerSystemService.Models
{
    public partial class AdminDetail
    {
        public int Adminid { get; set; }
        public int Clientid { get; set; }
        public string LegalName { get; set; }
        public string VatNumber { get; set; }
        public string BankName { get; set; }
        public string AccountNumber { get; set; }
        public string Bic { get; set; }
        public string Iban { get; set; }
    }
}
