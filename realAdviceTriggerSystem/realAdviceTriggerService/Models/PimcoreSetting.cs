using System;
using System.Collections.Generic;

namespace realAdviceTriggerSystemService.Models
{
    public partial class PimcoreSetting
    {
        public int PimcoreSettingid { get; set; }
        public int? Officeid { get; set; }
        public int? WhiseOfficeid { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string LoginId { get; set; }
        public DateTime? CreatedOn { get; set; } 
    } 
}
