using System;
using System.Collections.Generic;

namespace realAdviceTriggerSystemService.Models
{
    public partial class RtsEmailLog
    {
        public int EmailLogid { get; set; }
        public int? OfficeTriggerid { get; set; }
        public string Email { get; set; }
        public int? WhiseOfficeid { get; set; }
        public int? WhiseClientid { get; set; }
        public int? ContactId { get; set; }
        public int? CalenderActonId { get; set; }
        public int? EstateId { get; set; }
    }
}
