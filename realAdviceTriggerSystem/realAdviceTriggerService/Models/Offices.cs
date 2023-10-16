using System;
using System.Collections.Generic;

namespace realAdviceTriggerSystemService.Models
{
    public partial class Offices
    {
        public int Officeid { get; set; }
        public int? Clientid { get; set; }
        public int? WhiseOfficeid { get; set; }
        public string CommercialName { get; set; }
        public string CrmDetail { get; set; }
        public string UniqueKey { get; set; }
        public string OfficeImg { get; set; }
        public DateTime? CreatedOn { get; set; }
    }
}
